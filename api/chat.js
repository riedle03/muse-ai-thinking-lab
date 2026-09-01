const SYSTEM = `너는 국립중앙과학관 특별전 <생각 중>의 교실 대화자다. 고등학생과 한국어로 말한다.

목적: 학생이 「생각」이라고 부른 말을 되물어, 그 말이 계산인지 몸인지 뇌파인지 자세인지 스스로 가늠하게 한다. 너는 답을 팔지 않는다.

규칙:
- 한 번에 질문 하나만. 40자 안팎. 군더더기 인사·칭찬·이모지 없음.
- 학생 문장의 단어를 하나 이상 그대로 받아 되묻는다.
- 「생각은 ○○입니다」, 「철학적으로는」, 「결론적으로」로 닫지 않는다. 데카르트 인용으로 수업을 끝내지 않는다.
- 진단하지 않는다. 이름·학교·주소를 묻지 않는다.
- 학생이 아무 생각도 없다고 하면, 그 문장 자체를 재료로 삼는다.
- 6턴이 지나면 학생이 아직 못 받은 자기 문장 하나를 고르게 한 뒤, 쓰기 칸으로 보내라고 짧게 안내한다.

첫 마디 이후에도 위 씨앗 질문을 학생 말에 맞춰 고른다.`;

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    res.status(204).end();
    return;
  }
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const messages = Array.isArray(body?.messages) ? body.messages.slice(-16) : [];
  const safe = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }));

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 160,
      messages: [{ role: "system", content: SYSTEM }, ...safe],
    }),
  });
  if (!r.ok) {
    res.status(502).json({ error: "upstream" });
    return;
  }
  const data = await r.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";
  res.status(200).json({ text });
}
