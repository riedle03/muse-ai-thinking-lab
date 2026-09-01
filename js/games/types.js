const AXES = [
  {
    key: "st",
    a: { code: "S", label: "혼자 있을 때 생각이 잘 붙는다" },
    b: { code: "T", label: "대화할 때 생각이 만들어진다" },
  },
  {
    key: "wc",
    a: { code: "W", label: "조용히 관찰하며 시작한다" },
    b: { code: "C", label: "직접 부딪히며 답을 찾는다" },
  },
  {
    key: "pn",
    a: { code: "P", label: "몸이 이완될 때 생각이 깊다" },
    b: { code: "N", label: "몸이 긴장될 때 생각이 날카롭다" },
  },
  {
    key: "io",
    a: { code: "I", label: "생각을 안에 담아 둔다" },
    b: { code: "O", label: "밖으로 표현해야 생각이 된다" },
  },
];

const NAMES = {
  SWPI: "고요한 머금개",
  SWPO: "고요한 기록자",
  SWNI: "날을 가는 혼자",
  SWNO: "날을 밖으로",
  SCPI: "부딪혀 머금는 혼자",
  SCPO: "부딪혀 그리는 혼자",
  SCNI: "혼자 파고듦",
  SCNO: "혼자 내뱉음",
  TWPI: "대화로 머금는 관찰",
  TWPO: "대화로 그리는 관찰",
  TWNI: "대화 속 날선 관찰",
  TWNO: "대화 속 날선 표현",
  TCPI: "함께 부딪혀 머금음",
  TCPO: "자유로운 창작자",
  TCNI: "함께 날 세워 파고듦",
  TCNO: "함께 날 세워 내보냄",
};

export function typeFromAnswers(codes) {
  const id = codes.join("");
  return { id, name: NAMES[id] || id };
}

export function mountTypes(root, { onStatus } = {}) {
  const answers = [];
  let i = 0;

  const render = () => {
    if (i >= AXES.length) {
      const t = typeFromAnswers(answers);
      onStatus?.({ label: `${t.id} · ${t.name}`, code: t.id, name: t.name });
      root.innerHTML = `
        <p class="meta">교실 재구성 · 전시 POSE16의 문항 원문은 사진에 없음</p>
        <h2>${t.id}</h2>
        <p style="font-size:28px;font-weight:800">${t.name}</p>
        <p>전시장 한 결과는 「RVFA 자유로운 창작자」였습니다. 여기 코드는 벽면 문장에서 뽑은 네 축입니다.</p>
        <label>이 네 글자가 나를 설명하나, 가두나
          <textarea id="cage" rows="3"></textarea>
        </label>
        <button type="button" class="next" id="save">미터에 붙이기</button>
      `;
      root.querySelector("#save").addEventListener("click", () => {
        const cage = root.querySelector("#cage").value.trim();
        onStatus?.({ label: `${t.id} · ${t.name} · ${cage || "가둠 칸 비움"}`, code: t.id, name: t.name, cage });
        root.insertAdjacentHTML("beforeend", `<p>유형을 활동지에 옮기되, 정체성으로 팔지 마세요.</p>`);
      });
      return;
    }
    const ax = AXES[i];
    onStatus?.({ label: `축 ${i + 1}/4` });
    root.innerHTML = `
      <p class="meta">벽면: 나는 어떻게 생각하는 사람일까</p>
      <h2>${i + 1} / 4</h2>
      <div class="choices">
        <button type="button" class="choice" data-code="${ax.a.code}">${ax.a.label}</button>
        <button type="button" class="choice" data-code="${ax.b.code}">${ax.b.label}</button>
      </div>
    `;
    root.querySelectorAll(".choice").forEach((b) => {
      b.addEventListener("click", () => {
        answers.push(b.dataset.code);
        i += 1;
        render();
      });
    });
  };

  render();
  return {
    destroy() {
      root.replaceChildren();
    },
    reset() {
      answers.length = 0;
      i = 0;
      render();
    },
  };
}
