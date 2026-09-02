import { loadCard } from "./card.js";
import { station, STATIONS } from "./stations.js";

function esc(s) {
  return String(s || " ").replaceAll("<", "&lt;");
}

export function renderSheets(el) {
  const c = loadCard();
  const st = station(c.station) || STATIONS[0];
  const where = c.where === "kiosk" ? "과학관 전시" : "웹앱";
  el.innerHTML = `
    <article class="a4">
      <p class="meta">생각 중 · 고등 · 1/3 · Prologue</p>
      <h1>1차시 · 질문하기</h1>
      <p class="meta">학번 ________ 이름 ${esc(c.names) || "________"} 모둠 ${esc(c.group) || "________"}</p>
      <p class="epi">지금 무슨 생각을 하고 있나요?</p>
      <div class="blank">${esc(c.now)}</div>
      <h2>나의 탐구질문</h2>
      <div class="blank">${esc(c.mine)}</div>
      <h2>만든 이유</h2>
      <div class="blank">${esc(c.why)}</div>
      <h2>모둠이 고른 탐구질문</h2>
      <div class="blank">${esc(c.picked)}</div>
      <p>탐구할 부: <strong>${st.part} · ${st.title}</strong> · 카드 ID: <strong>${c.id || "—"}</strong></p>
      <p>오늘 장소: ${where}</p>
    </article>
    <article class="a4">
      <p class="meta">생각 중 · 고등 · 2/3 · Part 1–4</p>
      <h1>2차시 · 탐구하기</h1>
      <p>모둠 탐구질문(카드 ${c.id || "—"})을 다시 적습니다.</p>
      <div class="blank">${esc(c.picked)}</div>
      <p>장소 □ 과학관 전시  □ 웹앱  (표시: ${where})</p>
      <h2>부에서 잰 것</h2>
      <p>${st.title} 미터를 그대로 옮기세요. 계산=일치, 재기=초·실수·긴장, 몸=유지 초·움직임, 되물음=턴 수.</p>
      <div class="blank">${esc(c.meter)}</div>
      <h2>그 숫자가 우리 질문에 답이 되나</h2>
      <div class="blank"> </div>
      <p>Part 4 리플릿: 인간의 뇌와 기계가 같은 질문에 답하기 위해 쓰는 에너지는 얼마나 다를까요? 오늘 자리와 겹치면 여기 적으세요.</p>
      <div class="blank"> </div>
    </article>
    <article class="a4">
      <p class="meta">생각 중 · 고등 · 3/3 · Epilogue</p>
      <h1>3차시 · 쓰기</h1>
      <p class="epi">지금 무슨 생각을 하고 있나요?</p>
      <p>전시를 나서며 다시 마주하는 질문입니다.</p>
      <h2>들어가며 적었던 한 줄</h2>
      <div class="blank">${esc(c.now)}</div>
      <h2>나서며 다시 적는 한 줄</h2>
      <div class="blank"> </div>
      <h2>당신의 답은 처음과 같을까요?</h2>
      <div class="blank"> </div>
      <h2>우리 탐구질문 / 잰 것 / 결론 한 문장</h2>
      <div class="blank">${esc(c.picked)}</div>
      <div class="blank">${esc(c.meter)}</div>
      <div class="blank"> </div>
      <h2>AI가 되물은 것 중 내가 못 받은 질문</h2>
      <div class="blank">${esc(c.leftover)}</div>
    </article>
  `;
}

export function renderGuide(el) {
  el.innerHTML = `
    <article class="a4 guide">
      <p class="meta">MUSE-AI · 교사용 · 고등</p>
      <h1>생각 중 · 질문하기-탐구하기-쓰기</h1>
      <p>현장 IMG_8969–8994 + 리플릿 IMG_9087–9089. 교실 웹앱만으로 성립.</p>
      <h2>1차시 질문하기 (50분)</h2>
      <p>리플릿 프롤로그: 지금 무슨 생각을 하고 있나요. 그 한 줄을 카드에 남긴 뒤 탐구질문. 모둠 선정 → 카드 ID. 부 하나.</p>
      <h2>2차시 탐구하기 (50분)</h2>
      <p>Part 1 나란히 / Part 2 뇌파 대용 / Part 3 자세 / POSE16 / 되물음. 한 부만. 미터를 읽는다.</p>
      <h2>3차시 쓰기 (40분)</h2>
      <p>에필로그: 다시 같은 질문. 처음과 같은가. 챗의 정의를 받아 적지 않는다.</p>
      <p><strong>철칙:</strong> 보드는 1차 자료. 실제 EEG 없음. 조각 사진 없음. GPT 키 없으면 로컬 꼬리질문.</p>
      <p>주최 국립중앙과학관. 협력 KIST, Lucerium ROBOTICS.</p>
    </article>
  `;
}
