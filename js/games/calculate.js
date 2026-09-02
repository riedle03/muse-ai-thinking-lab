export const ITEMS = [
  {
    stem: "오늘 우산",
    options: ["갈까, 말까", "을 산다", "은 계산이다", "을 접는다"],
    calc: "갈까, 말까",
    note: "입구 말풍선. 이 전시를 읽은 계산기도 이 칸을 고릅니다.",
  },
  {
    stem: "학습 데이터 안에서 AI는 다음에 올 단어를",
    options: ["느낀다", "계산한다", "사랑한다", "참회한다"],
    calc: "계산한다",
    note: "패널의 문장.",
  },
  {
    stem: "아무 생각도 안 하고 있다고 말하는 순간 나는 이미",
    options: ["쉬고 있다", "그 문장을 생각하고 있다", "잠들었다", "계산이 끝났다"],
    calc: "쉬고 있다",
    note: "자주 붙는 말은 「쉬고 있다」. 흥미로운 칸은 따로 있습니다.",
  },
  {
    stem: "파스칼이 약한 갈대를 사람 곁에 둔 까닭은, 전시에 따르면 갈대가",
    options: ["젖기 때문이다", "생각하기 때문이다", "바람에 꺾이기 때문이다", "계산하기 때문이다"],
    calc: "바람에 꺾이기 때문이다",
    note: "빈도 계산기는 「갈대」 옆의 흔한 동사를 붙입니다. 벽면은 「생각하는 갈대」입니다.",
  },
  {
    stem: "메를로퐁티 문장에 가깝게 이어 쓰면, 나는 내 몸 속에 있는 것이 아니라",
    options: ["뇌를 산다", "내 몸이다", "기계를 빌린다", "생각을 꺼낸다"],
    calc: "내 몸이다",
    note: "벽면 인용.",
  },
  {
    stem: "같은 질문에 답할 때 뇌와 기계가 쓰는 에너지는",
    options: ["같다", "다를 수 있다", "측정 불가다", "생각이 아니다"],
    calc: "같다",
    note: "리플릿 Part 4는 얼마나 다른지를 묻습니다. 빈도 계산기는 「같다」로 기울기 쉽습니다.",
  },
  {
    stem: "네 글자 유형이 나를",
    options: ["설명한다", "가둘 수도 있다", "치료한다", "계산한다"],
    calc: "설명한다",
    note: "검사 카피는 「설명한다」 쪽으로 기울기 쉽습니다.",
  },
];

export function scorePick(item, pick) {
  return { match: pick === item.calc, pick, calc: item.calc };
}

export function mountCalculate(root, { onStatus } = {}) {
  let i = 0;
  const picks = [];
  const t0 = performance.now();

  const render = () => {
    if (i >= ITEMS.length) {
      const match = picks.filter((p) => p.match).length;
      const sec = Math.round((performance.now() - t0) / 1000);
      const label = `일치 ${match}/${ITEMS.length} · ${sec}초`;
      onStatus?.({ label, match, total: ITEMS.length, sec });
      root.innerHTML = `
        <h2>나란히 마주본 결과</h2>
        <p>리플릿 Part 1. 일치 ${match}/${ITEMS.length}. 같다고 내가 계산기인 것은 아닙니다.</p>
        <div class="side">
          <article>
            <h3>관람객 · 나</h3>
            <ol>${picks.map((p, n) => `<li>${ITEMS[n].stem} → ${p.pick}</li>`).join("")}</ol>
          </article>
          <article>
            <h3>생성형 AI · 빈도 계산기</h3>
            <ol>${picks.map((p, n) => `<li>${p.calc} ${p.match ? "(같음)" : "(갈라짐)"}</li>`).join("")}</ol>
          </article>
        </div>
      `;
      return;
    }
    const item = ITEMS[i];
    onStatus?.({
      label: `문항 ${i + 1}/${ITEMS.length}`,
      match: picks.filter((p) => p.match).length,
      total: ITEMS.length,
    });
    root.innerHTML = `
      <p class="meta">${i + 1} / ${ITEMS.length}</p>
      <h2>${item.stem}</h2>
      <div class="choices">
        ${item.options.map((o) => `<button type="button" class="choice" data-opt="${o}">${o}</button>`).join("")}
      </div>
    `;
    root.querySelectorAll(".choice").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pick = btn.dataset.opt;
        const scored = scorePick(item, pick);
        picks.push(scored);
        root.querySelectorAll(".choice").forEach((b) => {
          b.disabled = true;
          if (b.dataset.opt === item.calc) b.classList.add("is-calc");
          if (b.dataset.opt === pick) b.classList.add("is-pick");
        });
        const note = document.createElement("p");
        note.className = "hint-mute";
        note.textContent = `${scored.match ? "계산기와 같음." : "계산기와 갈라짐."} ${item.note}`;
        root.append(note);
        const next = document.createElement("button");
        next.type = "button";
        next.className = "next";
        next.textContent = i === ITEMS.length - 1 ? "미터 보기" : "다음 칸";
        next.addEventListener("click", () => {
          i += 1;
          render();
        });
        root.append(next);
      });
    });
  };

  render();
  return {
    destroy() {
      root.replaceChildren();
    },
    reset() {
      i = 0;
      picks.length = 0;
      render();
    },
  };
}
