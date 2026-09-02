import { OPENING } from "./socratic.js";
import { fallbackReply } from "./chat-fallback.js";
import { loadCard, saveCard } from "./card.js";

export function mountChat({ logEl, formEl, inputEl, meterEl, noteEl, onStatus }) {
  const history = [];
  let turns = 0;
  let source = "local";

  const add = (role, text) => {
    history.push({ role, content: text });
    const div = document.createElement("div");
    div.className = `bubble ${role === "assistant" ? "ai" : "me"}`;
    div.textContent = text;
    logEl.append(div);
    logEl.scrollTop = logEl.scrollHeight;
  };

  const emit = () => {
    const lastQ = [...history].reverse().find((m) => m.role === "assistant")?.content || "";
    const label = `턴 ${turns} · ${source === "gpt" ? "GPT" : "로컬 질문"}`;
    meterEl.textContent = label;
    onStatus?.({ label, turns, lastQ, source });
    const card = loadCard();
    card.meter = label;
    saveCard(card);
  };

  add("assistant", OPENING);
  noteEl.textContent = "키를 넣기 전에는 로컬 꼬리질문입니다. 정의는 사지 마세요.";
  emit();

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    add("user", text);
    turns += 1;
    let reply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          reply = data.text;
          source = "gpt";
        }
      }
    } catch {
      /* fall through */
    }
    if (!reply) {
      reply = fallbackReply(history);
      source = "local";
    }
    add("assistant", reply);
    if (turns >= 6) {
      noteEl.textContent = "에필로그입니다. 쓰기 3장에 처음과 같은지를 적으세요.";
      const card = loadCard();
      card.leftover = reply;
      saveCard(card);
    }
    emit();
  });

  return {
    destroy() {},
  };
}
