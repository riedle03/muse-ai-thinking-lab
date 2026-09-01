function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function mountFocus(root, { onStatus } = {}) {
  const state = { phase: "num", numSec: 0, diffs: 0, miss: 0, tension: null };
  let session = { stop: () => {} };

  const emit = () => {
    const parts = [`숫자 ${state.numSec || "—"}초`, `그림 실수 ${state.miss}`, `긴장 ${state.tension ?? "—"}`];
    onStatus?.({ label: parts.join(" · ") + " · 뇌파 아님", ...state });
  };

  const startNum = () => {
    state.phase = "num";
    const n = 12;
    const t0 = performance.now();
    let expect = 1;
    root.innerHTML = `
      <h2>숫자 찾기</h2>
      <p>1부터 ${n}까지 순서대로 누르세요. 전시장 키오스크의 첫 과제입니다.</p>
      <div class="num-board" id="board"></div>
    `;
    const board = root.querySelector("#board");
    const placed = [];
    for (const num of shuffle([...Array(n)].map((_, i) => i + 1))) {
      let x = 8 + Math.random() * 84;
      let y = 8 + Math.random() * 78;
      let tries = 0;
      while (placed.some((p) => Math.hypot(p.x - x, p.y - y) < 12) && tries++ < 20) {
        x = 8 + Math.random() * 84;
        y = 8 + Math.random() * 78;
      }
      placed.push({ x, y });
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = String(num);
      b.style.left = `${x}%`;
      b.style.top = `${y}%`;
      b.addEventListener("click", () => {
        if (num !== expect) return;
        b.disabled = true;
        b.style.opacity = "0.3";
        expect += 1;
        if (expect > n) {
          state.numSec = Math.round((performance.now() - t0) / 1000);
          emit();
          startDiff();
        }
      });
      board.append(b);
    }
    emit();
  };

  const startDiff = () => {
    state.phase = "diff";
    const found = new Set();
    const spots = [
      { x: 82, y: 28, r: 28, label: "해 없음" },
      { x: 40, y: 70, r: 24, label: "여우 꼬리" },
      { x: 70, y: 78, r: 22, label: "그루터기 구멍" },
      { x: 22, y: 48, r: 20, label: "새 한 마리" },
    ];
    root.innerHTML = `
      <h2>틀린 그림 찾기</h2>
      <p>오른쪽에서 다른 점을 누르세요. ${spots.length}개. 전시장 두 번째 과제입니다.</p>
      <p id="diff-stat">찾음 0 / ${spots.length} · 실수 0</p>
      <div class="diff-wrap">
        ${scene(false)}
        ${scene(true)}
      </div>
    `;
    const right = root.querySelector("[data-side=right]");
    right.addEventListener("click", (ev) => {
      const svg = right;
      const pt = svg.createSVGPoint();
      pt.x = ev.clientX;
      pt.y = ev.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const loc = pt.matrixTransform(ctm.inverse());
      const hit = spots.find((s) => Math.hypot(s.x - loc.x, s.y - loc.y) <= s.r);
      if (hit && !found.has(hit.label)) {
        found.add(hit.label);
        const mark = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        mark.setAttribute("cx", hit.x);
        mark.setAttribute("cy", hit.y);
        mark.setAttribute("r", "10");
        mark.setAttribute("fill", "none");
        mark.setAttribute("stroke", "#dc5a12");
        mark.setAttribute("stroke-width", "3");
        svg.append(mark);
      } else if (!hit) {
        state.miss += 1;
      }
      root.querySelector("#diff-stat").textContent = `찾음 ${found.size} / ${spots.length} · 실수 ${state.miss}`;
      state.diffs = found.size;
      emit();
      if (found.size >= spots.length) startImagine();
    });
    emit();
  };

  const startImagine = () => {
    state.phase = "imagine";
    let left = 10;
    root.innerHTML = `
      <h2>10초 상상</h2>
      <p>전시장 세 번째 과제입니다. 눈을 감아도 됩니다. 행복한 순간을 떠올리세요.</p>
      <p class="timer" id="t">10</p>
    `;
    const id = setInterval(() => {
      left -= 1;
      const el = root.querySelector("#t");
      if (el) el.textContent = String(left);
      if (left <= 0) {
        clearInterval(id);
        root.innerHTML = `
          <h2>지금 긴장은</h2>
          <p>교실 대용입니다. 뇌파가 아닙니다.</p>
          <label>1 이완 — 5 경직
            <input id="ten" type="range" min="1" max="5" value="3" />
          </label>
          <p id="ten-v">3</p>
          <button type="button" class="next" id="done">미터 확정</button>
        `;
        const ten = root.querySelector("#ten");
        ten.addEventListener("input", () => {
          root.querySelector("#ten-v").textContent = ten.value;
        });
        root.querySelector("#done").addEventListener("click", () => {
          state.tension = Number(ten.value);
          emit();
          root.innerHTML = `
            <h2>교실 대용 미터</h2>
            <p>숫자 ${state.numSec}초 · 그림 실수 ${state.miss} · 긴장 ${state.tension}</p>
            <p>과학관 점수가 생각을 잰 것인지, 이 숫자가 같은 질문에 답이 되는지 활동지에 적으세요.</p>
          `;
        });
      }
    }, 1000);
    session.stop = () => clearInterval(id);
    emit();
  };

  startNum();
  return {
    destroy() {
      session.stop();
      root.replaceChildren();
    },
    reset() {
      session.stop();
      state.numSec = 0;
      state.diffs = 0;
      state.miss = 0;
      state.tension = null;
      startNum();
    },
  };
}

function scene(variant) {
  const sun = variant ? "" : `<circle cx="82" cy="28" r="10" fill="#ffd166"/>`;
  const bird = variant ? "" : `<ellipse cx="22" cy="48" rx="6" ry="3" fill="#333"/>`;
  const tail = variant ? `M38 70 L52 62` : `M38 70 L50 78`;
  const hole = variant ? `<circle cx="70" cy="78" r="3" fill="#5c3d2e"/>` : "";
  return `
    <svg viewBox="0 0 100 100" data-side="${variant ? "right" : "left"}">
      <rect width="100" height="100" fill="#b8e0ff"/>
      <rect y="70" width="100" height="30" fill="#8fbf6a"/>
      ${sun}
      <polygon points="12,70 28,38 44,70" fill="#3d6b4f"/>
      <circle cx="36" cy="72" r="10" fill="#e09f3e"/>
      <path d="${tail}" stroke="#c45c26" stroke-width="3" fill="none"/>
      <rect x="62" y="74" width="16" height="10" fill="#8a5a3b"/>
      ${hole}
      ${bird}
    </svg>
  `;
}
