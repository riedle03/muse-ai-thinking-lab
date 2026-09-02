export const STATIONS = [
  {
    id: "calculate",
    part: "Part 1",
    title: "계산인가",
    line: "AI의 다음 칸과 내 칸을 나란히 둡니다. 생각 중일까요, 계산 중일까요?",
    plaque: {
      kicker: "Part 1 · 생각은 무엇일까?",
      title: "나란히 마주보기",
      body: "리플릿: 생성형 AI가 생각하는 모습과 관람객의 생각을 나란히 마주합니다. 승리는 없습니다. 일치 횟수가 미터입니다.",
    },
  },
  {
    id: "focus",
    part: "Part 2",
    title: "재어지나",
    line: "숫자 찾기, 틀린 그림, 10초 상상. 뇌파가 아닙니다.",
    plaque: {
      kicker: "Part 2 · 생각은 어디서 시작될까?",
      title: "전기와 화학의 교실 대용",
      body: "리플릿: 생각은 뇌 속 전기/화학 신호로 나타납니다. 교실에는 헤드밴드가 없습니다. 시간·실수·자기보고를 적되 뇌파라고 부르지 마세요.",
    },
  },
  {
    id: "pose",
    part: "Part 3",
    title: "몸인가",
    line: "이완 자세 또는 긴장 자세를 유지하고 그때 생각을 적습니다.",
    plaque: {
      kicker: "Part 3 · 생각과 우리 몸",
      title: "두 자세",
      body: "리플릿: 반가사유상과 생각하는 사람은 서로 다른 자세로 사유를 표현합니다. 토드 문장을 그대로 믿을 필요는 없습니다.",
    },
  },
  {
    id: "types",
    part: "POSE 16",
    title: "나의 생각하는 자세",
    line: "네 축으로 유형을 받은 뒤, 가두는지를 적습니다. 안내데스크 포토카드는 과학관에서.",
    plaque: {
      kicker: "나의 생각하는 자세",
      title: "유형은 설명인가 가둠인가",
      body: "리플릿 뒷면: 참여 후 안내데스크에서 포토카드를 받습니다. 교실판은 벽면 문장에서 뽑은 네 축입니다.",
    },
  },
  {
    id: "chat",
    part: "Part 1 · 나란히",
    title: "되물음",
    line: "AI가 묻고, 내가 답합니다. 정의는 사지 않습니다.",
    plaque: {
      kicker: "생성형 AI와 나란히",
      title: "꼬리질문",
      body: "리플릿 Part 1: AI는 생각 중인 걸까요, 아니면 계산하고 있는 걸까요. 챗이 정의를 내리면 그 문장은 버립니다. 에필로그에서 처음과 같은지 다시 묻습니다.",
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
      <span class="part">${s.part}</span>
      <strong>${s.title}</strong>
      <em>${s.line}</em>
      <div class="cta-row">
        <a href="#${primaryHref}/${s.id}" class="primary">이걸로 탐구하기</a>
      </div>
    </article>`
  ).join("");
}
