import { station, stationCards } from "./stations.js";
import { renderAsk, loadCard, saveCard } from "./card.js";
import { renderSheets, renderGuide } from "./sheets.js";
import { mountCalculate } from "./games/calculate.js";
import { mountFocus } from "./games/focus.js";
import { mountPose } from "./games/pose.js";
import { mountTypes } from "./games/types.js";
import { mountChat } from "./chat.js";

const mounts = { calculate: mountCalculate, focus: mountFocus, pose: mountPose, types: mountTypes };
const views = {
  hub: document.querySelector("#hub"),
  inquire: document.querySelector("#inquire-view"),
  play: document.querySelector("#play"),
  ask: document.querySelector("#ask-view"),
  sheet: document.querySelector("#sheet-view"),
  guide: document.querySelector("#guide-view"),
  chat: document.querySelector("#chat-view"),
};

let session = null;
let chatSession = null;

function show(name) {
  Object.entries(views).forEach(([k, el]) => {
    if (el) el.hidden = k !== name;
  });
  document.body.dataset.view = name;
}

function teacherOn() {
  return sessionStorage.getItem("muse-thinking-teacher") === "1";
}

function applyTeacher() {
  const on = teacherOn();
  document.body.classList.toggle("is-teacher", on);
  document.querySelector("#teacher").setAttribute("aria-pressed", on ? "true" : "false");
}

function renderHub() {
  document.querySelector("#cards").innerHTML = stationCards("inquire");
  const card = loadCard();
  const p = document.querySelector(".path li:first-child p");
  if (p && card.id) p.textContent = `지금 카드 ${card.id}. 모둠 질문을 한 줄로 남깁니다.`;
}

function plaqueFor(id) {
  const s = station(id);
  const el = document.querySelector("#plaque");
  if (!s) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = `<p class="kicker">${s.plaque.kicker}</p><h2>${s.plaque.title}</h2><p>${s.plaque.body}</p>`;
}

function openPlay(id) {
  if (id === "chat") {
    location.hash = "#chat";
    return;
  }
  if (!mounts[id]) return;
  session?.destroy?.();
  show("play");
  const q = loadCard();
  document.querySelector("#mode-tag").textContent = `2걸음 · 탐구하기${q.id ? ` · ${q.id}` : ""}`;
  const strip = document.querySelector("#ask-strip");
  strip.hidden = false;
  strip.textContent = q.picked ? `우리 질문 · ${q.id || "카드"} · ${q.picked}` : "탐구질문카드에 모둠 질문을 먼저 남기세요.";
  const stage = document.querySelector("#stage");
  stage.replaceChildren();
  plaqueFor(id);
  session = mounts[id](stage, {
    onStatus(state) {
      document.querySelector("#stat").textContent = state.label || "";
      document.querySelector("#meter").textContent = state.label || "—";
      const card = loadCard();
      card.station = id;
      card.meter = state.label || "";
      saveCard(card);
    },
  });
  document.querySelector("#btn-reset").onclick = () => session?.reset?.();
}

function openChat() {
  session?.destroy?.();
  session = null;
  chatSession?.destroy?.();
  show("chat");
  const q = loadCard();
  const strip = document.querySelector("#chat-strip");
  strip.hidden = false;
  strip.textContent = q.picked ? `우리 질문 · ${q.id || "카드"} · ${q.picked}` : "카드가 없어도 대화는 됩니다.";
  const log = document.querySelector("#chat-log");
  log.replaceChildren();
  const form = document.querySelector("#chat-form");
  const fresh = form.cloneNode(true);
  form.replaceWith(fresh);
  document.querySelector("#chat-plaque").innerHTML = `<p class="kicker">생각은 무엇인가</p><h2>꼬리질문</h2><p>한 번에 하나. 정의를 사지 마세요. 6턴이 지나면 못 받은 문장을 쓰기 칸으로.</p>`;
  chatSession = mountChat({
    logEl: log,
    formEl: fresh,
    inputEl: fresh.querySelector("#chat-input"),
    meterEl: document.querySelector("#chat-meter"),
    noteEl: document.querySelector("#chat-note"),
  });
}

function route() {
  const raw = location.hash.replace(/^#/, "") || "hub";
  const [view, id] = raw.split("/");
  applyTeacher();
  if (view === "ask") {
    session?.destroy?.();
    show("ask");
    renderAsk(document.querySelector("#ask-root"));
    return;
  }
  if (view === "inquire" && !id) {
    session?.destroy?.();
    show("inquire");
    document.querySelector("#inquire-cards").innerHTML = stationCards("inquire");
    return;
  }
  if (view === "inquire" && id) {
    openPlay(id);
    return;
  }
  if (view === "chat") {
    openChat();
    return;
  }
  if (view === "write") {
    session?.destroy?.();
    show("sheet");
    renderSheets(document.querySelector("#sheet-root"));
    return;
  }
  if (view === "guide") {
    session?.destroy?.();
    show("guide");
    renderGuide(document.querySelector("#guide-root"));
    return;
  }
  session?.destroy?.();
  show("hub");
  renderHub();
}

document.querySelector("#teacher").addEventListener("click", () => {
  sessionStorage.setItem("muse-thinking-teacher", teacherOn() ? "0" : "1");
  applyTeacher();
});
document.querySelector("#sheet-print")?.addEventListener("click", () => window.print());
document.querySelector("#guide-print")?.addEventListener("click", () => window.print());
window.addEventListener("hashchange", route);
route();
