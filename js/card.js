const KEY = "muse-thinking-card";
import { STATIONS } from "./stations.js";

export function emptyCard() {
  return {
    id: "",
    group: "",
    names: "",
    station: "calculate",
    mine: "",
    why: "",
    picked: "",
    now: "",
    where: "web",
    meter: "",
    leftover: "",
  };
}

export function loadCard() {
  try {
    return { ...emptyCard(), ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return emptyCard();
  }
}

export function saveCard(card) {
  localStorage.setItem(KEY, JSON.stringify(card));
  return card;
}

export function issueId() {
  return `T-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function renderAsk(root, onIssued) {
  const c = loadCard();
  root.innerHTML = `
    <article class="a4 red-sheet">
      <p class="meta">Prologue · 1차시 · 고등</p>
      <h1>탐구질문카드</h1>
      <p>리플릿은 들어가며와 나서며 같은 질문을 둡니다. 먼저 그 한 줄을 적습니다.</p>
      <label>지금 무슨 생각을 하고 있나요?
        <textarea id="rc-now" rows="2">${esc(c.now)}</textarea>
      </label>
      <label>모둠 이름 <input id="rc-group" value="${esc(c.group)}" /></label>
      <label>내 이름 <input id="rc-names" value="${esc(c.names)}" /></label>
      <label>내가 만든 탐구질문
        <textarea id="rc-mine" rows="3">${esc(c.mine)}</textarea>
      </label>
      <label>왜 이 질문인가요
        <textarea id="rc-why" rows="2">${esc(c.why)}</textarea>
      </label>
      <label>모둠이 고른 질문 (한 줄)
        <textarea id="rc-picked" rows="3">${esc(c.picked)}</textarea>
      </label>
      <label>오늘 셀 자리
        <select id="rc-station">${STATIONS.map(
          (s) => `<option value="${s.id}" ${c.station === s.id ? "selected" : ""}>${s.title}</option>`
        ).join("")}</select>
      </label>
      <label>어디서 하나요
        <select id="rc-where">
          <option value="web" ${c.where === "web" ? "selected" : ""}>이 화면 (웹앱)</option>
          <option value="kiosk" ${c.where === "kiosk" ? "selected" : ""}>과학관 전시</option>
        </select>
      </label>
      <p class="card-id">카드 번호: <strong id="rc-id">${c.id || "아직 없음"}</strong></p>
      <button type="button" class="next" id="rc-make">탐구질문카드 만들기</button>
      <p class="hint-mute">카드를 만들면 탐구하기에서 그 자리의 미터를 셉니다. AI에게 정의를 받아 적지 마세요.</p>
    </article>
  `;
  const read = () => ({
    ...loadCard(),
    group: root.querySelector("#rc-group").value,
    names: root.querySelector("#rc-names").value,
    now: root.querySelector("#rc-now").value,
    mine: root.querySelector("#rc-mine").value,
    why: root.querySelector("#rc-why").value,
    picked: root.querySelector("#rc-picked").value,
    station: root.querySelector("#rc-station").value,
    where: root.querySelector("#rc-where").value,
  });
  root.querySelector("#rc-make").addEventListener("click", () => {
    const next = read();
    if (!next.picked.trim()) {
      alert("모둠이 고른 탐구질문을 적으세요.");
      return;
    }
    if (!next.id) next.id = issueId();
    saveCard(next);
    root.querySelector("#rc-id").textContent = next.id;
    let go = root.querySelector("#rc-go");
    if (!go) {
      go = document.createElement("a");
      go.id = "rc-go";
      go.className = "btn primary";
      go.textContent = "탐구하러 가기";
      root.querySelector("#rc-make").after(go);
    }
    go.href = next.station === "chat" ? "#chat" : `#inquire/${next.station}`;
    onIssued?.(next);
  });
}

function esc(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
