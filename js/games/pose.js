const POSES = [
  {
    id: "still",
    title: "평온 자세",
    how: "앉거나 서서 어깨를 내린다. 한 손을 가볍게 뺨 근처에. 발가락에만 작은 힘을. 조각 사진을 따라 그리지 마세요.",
    wave: "전시는 이 자세를 알파파(이완·내면)에 가깝다고 적습니다.",
  },
  {
    id: "tense",
    title: "긴장 자세",
    how: "상체를 앞으로 기울인다. 팔꿈치와 무릎이 엇갈리게. 발은 바닥을 민다. 로댕 사진을 넣지 마세요.",
    wave: "전시는 이 자세를 베타파(각성·문제)에 가깝다고 적습니다.",
  },
];

export function mountPose(root, { onStatus } = {}) {
  let chosen = null;
  let sec = 0;
  let moves = 0;
  let ticking = null;

  const emit = () => {
    onStatus?.({
      label: chosen ? `${chosen.title} · ${sec}초 · 움직임 ${moves}` : "자세를 고르세요",
      sec,
      moves,
      pose: chosen?.id,
    });
  };

  const pick = () => {
    root.innerHTML = `
      <h2>한 자세만 고르세요</h2>
      <p>뉴럴 실루엣은 천천히 움직일수록 빛이 모인다고 했습니다. 교실에서는 유지 초와 움직임 횟수가 미터입니다.</p>
      <div class="pose-grid">
        ${POSES.map(
          (p) => `
          <button type="button" class="pose-card" data-id="${p.id}">
            <strong>${p.title}</strong>
            <p>${p.how}</p>
            <p class="hint-mute">${p.wave}</p>
          </button>`
        ).join("")}
      </div>
    `;
    root.querySelectorAll("[data-id]").forEach((b) => {
      b.addEventListener("click", () => {
        chosen = POSES.find((p) => p.id === b.dataset.id);
        run();
      });
    });
    emit();
  };

  const run = () => {
    sec = 0;
    moves = 0;
    root.innerHTML = `
      <h2>${chosen.title}</h2>
      <p>${chosen.how}</p>
      <p class="timer" id="t">0</p>
      <button type="button" class="choice" id="fidget">움직였다</button>
      <button type="button" class="next" id="stop">여기서 멈춤</button>
      <p class="hint-mute">30초를 채울 필요는 없습니다. 못 버티면 그 초가 자료입니다.</p>
    `;
    ticking = setInterval(() => {
      sec += 1;
      root.querySelector("#t").textContent = String(sec);
      emit();
    }, 1000);
    root.querySelector("#fidget").addEventListener("click", () => {
      moves += 1;
      emit();
    });
    root.querySelector("#stop").addEventListener("click", finish);
    emit();
  };

  const finish = () => {
    clearInterval(ticking);
    root.innerHTML = `
      <h2>그때의 생각</h2>
      <p>미터: ${chosen.title} · ${sec}초 · 움직임 ${moves}</p>
      <label>그 초 동안 떠오른 생각 한 줄
        <textarea id="thought" rows="3"></textarea>
      </label>
      <button type="button" class="next" id="save">미터에 붙이기</button>
    `;
    root.querySelector("#save").addEventListener("click", () => {
      const thought = root.querySelector("#thought").value.trim();
      onStatus?.({
        label: `${chosen.title} · ${sec}초 · 움직임 ${moves} · ${thought || "한 줄 없음"}`,
        sec,
        moves,
        thought,
        pose: chosen.id,
      });
      root.innerHTML = `<p>자세가 생각을 바꿨는지, 생각이 자세를 시켰는지 활동지에 적으세요.</p>`;
    });
  };

  pick();
  return {
    destroy() {
      clearInterval(ticking);
      root.replaceChildren();
    },
    reset() {
      clearInterval(ticking);
      chosen = null;
      sec = 0;
      moves = 0;
      pick();
    },
  };
}
