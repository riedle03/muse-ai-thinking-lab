export const STATIONS = [
  {
    id: "calculate",
    title: "계산인가",
    line: "다음 칸을 고르고, 빈도 계산기와 비교합니다",
    plaque: {
      kicker: "Part 1 · AI는 생각하는 걸까?",
      title: "다음 단어의 확률",
      body: "패널은 AI가 다음에 올 단어를 계산한다고 적습니다. 인간도 예측하지만 감각·감정·관계를 끌어옵니다. 승리는 없습니다. 일치 횟수가 미터입니다.",
    },
  },
  {
    id: "focus",
    title: "재어지나",
    line: "숫자 찾기, 틀린 그림, 10초 상상. 뇌파가 아닙니다",
    plaque: {
      kicker: "Part 2 · 생각이 움직이는 곳",
      title: "교실 대용 미터",
      body: "전시장은 헤드밴드로 집중력·스트레스 점수를 줍니다. 교실에는 그 기기가 없습니다. 시간·실수·자기보고를 적되, 이것을 뇌파라고 부르지 마세요.",
    },
  },
  {
    id: "pose",
    title: "몸인가",
    line: "이완 자세 또는 긴장 자세를 유지하고 그때 생각을 적습니다",
    plaque: {
      kicker: "Part 3 · 생각과 우리 몸",
      title: "평온 / 긴장",
      body: "반가사유는 이완 속에 발가락의 깨어 있음, 로댕은 앞으로 기울인 긴장. 전시는 알파파·베타파와 연결합니다. 토드 문장을 그대로 믿을 필요는 없습니다.",
    },
  },
  {
    id: "types",
    title: "자세 16",
    line: "벽면의 네 축으로 유형을 받은 뒤, 가두는지를 적습니다",
    plaque: {
      kicker: "POSE 16 · 나의 생각하는 자세",
      title: "유형은 설명인가 가둠인가",
      body: "전시는 네 질문에 답하고 유형을 줍니다. 교실판은 벽면 문장에서 뽑은 네 축입니다. 상업 검사 코드를 복제하지 않습니다.",
    },
  },
  {
    id: "chat",
    title: "되물음",
    line: "AI가 묻고, 내가 답합니다. 정의는 사지 않습니다",
    plaque: {
      kicker: "생각은 무엇인가",
      title: "꼬리질문",
      body: "전시는 한 정의로 닫지 않습니다. 챗이 「생각은 ○○이다」고 하면 그 문장은 버립니다. 미터는 턴 수와 내가 못 받은 문장입니다.",
    },
  },
];

export function station(id) {
  return STATIONS.find((s) => s.id === id);
}

export function stationCards(primaryHref) {
  return STATIONS.map(
    (s) => `
    <article class="station">
      <strong>${s.title}</strong>
      <em>${s.line}</em>
      <div class="cta-row">
        <a href="#${primaryHref}/${s.id}" class="primary">이걸로 탐구하기</a>
      </div>
    </article>`
  ).join("");
}
