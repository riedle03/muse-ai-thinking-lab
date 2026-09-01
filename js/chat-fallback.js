const SEEDS = [
  "너는 지금 무슨 생각하고 있어?",
  "네가 생각을 안 한다고 어떻게 생각을 한 거야?",
  "어제는 무슨 생각을 했어?",
  "그 생각은 뇌 안에서만 일어났나, 몸도 있었나?",
  "네가 방금 고른 다음 문장은 생각인가 예측인가?",
  "자세를 바꾸면 그 생각이 달라지나?",
];

export function fallbackReply(history) {
  const users = history.filter((m) => m.role === "user");
  const last = (users.at(-1)?.content || "").replace(/\s+/g, " ").trim();
  const n = users.length;

  if (n >= 6) {
    return "지금까지 네 문장 중, 아직 네가 못 받은 게 있다면 어느 문장인가. 그 줄을 쓰기 칸에 옮겨.";
  }
  if (/아무 생각|생각 없|멍/.test(last)) {
    return "아무 생각도 안 하고 있다고 했는데, 그것도 생각 아닐까?";
  }
  if (/모르겠|몰라/.test(last)) {
    return "모르겠다고 한 그 판단은, 생각인가?";
  }
  if (/계산|확률|단어|다음/.test(last)) {
    return "그 계산을 생각이라고 부르려면, 몸 없는 기계의 계산도 생각인가?";
  }
  if (/뇌파|점수|집중/.test(last)) {
    return "뇌파가 잠잠해도 생각은 있을 수 있나?";
  }
  if (/몸|자세|알파|베타/.test(last)) {
    return "자세가 생각을 바꿨나, 생각이 자세를 시켰나?";
  }
  if (/유형|네 글자|가둔/.test(last)) {
    return "그 네 글자가 너를 설명하나, 가두나?";
  }
  if (n === 1 && last.length < 80) {
    const word = last.replace(/[.?!"']/g, "").split(" ").filter((w) => w.length > 1).at(-1);
    if (word) return `네가 말한 「${word}」는, 지금 이 자리에서도 일어나고 있나?`;
  }
  return SEEDS[(n - 1) % SEEDS.length];
}
