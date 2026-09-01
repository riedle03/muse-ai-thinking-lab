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
      <p class="meta">생각 중 · 고등 · 1/3</p>
      <h1>1차시 · 질문하기</h1>
      <p class="meta">학번 ________ 이름 ${esc(c.names) || "________"} 모둠 ${esc(c.group) || "________"}</p>
      <p>의뢰: 특별전은 생각의 정의를 고르지 않는다. 모둠은 네 자리 중 하나만 고른다.</p>
      <h2>나의 탐구질문</h2>
      <div class="blank">${esc(c.mine)}</div>
      <h2>만든 이유</h2>
      <div class="blank">${esc(c.why)}</div>
      <h2>모둠이 고른 탐구질문</h2>
      <div class="blank">${esc(c.picked)}</div>
      <p>탐구할 자리: <strong>${st.title}</strong> · 카드 ID: <strong>${c.id || "—"}</strong></p>
      <p>오늘 장소: ${where}</p>
    </article>
    <article class="a4">
      <p class="meta">생각 중 · 고등 · 2/3</p>
      <h1>2차시 · 탐구하기</h1>
      <p>모둠 탐구질문(카드 ${c.id || "—"})을 다시 적습니다.</p>
      <div class="blank">${esc(c.picked)}</div>
      <p>장소 □ 과학관 전시  □ 웹앱  (표시: ${where})</p>
      <h2>자리에서 잰 것</h2>
      <p>${st.title} 미터를 그대로 옮기세요. 계산=일치 횟수, 재기=초·실수·긴장, 몸=유지 초·움직임, 되물음=턴 수.</p>
      <div class="blank">${esc(c.meter)}</div>
      <h2>그 숫자가 우리 질문에 답이 되나</h2>
      <div class="blank"> </div>
      <p>깨기가 목적이 아닙니다. 못 받아도 숫자가 있으면 탐구입니다. 뇌파라고 부르지 마세요.</p>
    </article>
    <article class="a4">
      <p class="meta">생각 중 · 고등 · 3/3</p>
      <h1>3차시 · 쓰기</h1>
      <h2>우리 탐구질문</h2>
      <div class="blank">${esc(c.picked)}</div>
      <h2>잰 것</h2>
      <div class="blank">${esc(c.meter)}</div>
      <h2>결론 한 문장</h2>
      <div class="blank"> </div>
      <h2>성찰 — 내가 한 일 / 남는 생각</h2>
      <div class="blank"> </div>
      <h2>AI가 되물은 것 중 내가 못 받은 질문 (챗을 안 했으면 다음에 묻고 싶은 한 줄)</h2>
      <div class="blank">${esc(c.leftover)}</div>
    </article>
  `;
}

export function renderGuide(el) {
  el.innerHTML = `
    <article class="a4 guide">
      <p class="meta">MUSE-AI · 교사용 · 고등</p>
      <h1>생각 중 · 질문하기-탐구하기-쓰기</h1>
      <p>사진 IMG_8969–8994. 교실 웹앱만으로 성립. 과학관은 최선. 초·중 분기는 없습니다.</p>
      <h2>1차시 질문하기 (50분)</h2>
      <p>말풍선 셋과 프롤로그를 읽는다. 개인 질문 → 모둠 선정 → 웹에서 탐구질문카드 → 카드 ID. 자리 하나.</p>
      <h2>2차시 탐구하기 (50분)</h2>
      <p>고른 자리를 전시 또는 웹앱에서. 미터를 읽는다. 네 자리를 다 깊게 하지 않는다.</p>
      <h2>3차시 쓰기 (40분)</h2>
      <p>종이 3장. 질문 + 잰 것 + 한 문장. 챗의 정의를 받아 적지 않는다.</p>
      <p><strong>철칙:</strong> 보드는 1차 자료. 실제 EEG 없음. 관람객 얼굴·조각 사진 없음. GPT 키가 없으면 로컬 꼬리질문.</p>
      <p>키: Vercel 환경변수 OPENAI_API_KEY. 모델 기본 gpt-4o-mini.</p>
    </article>
  `;
}
