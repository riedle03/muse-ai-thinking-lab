# 생각 중 · 고등 탐구

국립중앙과학관 특별전 &lt;생각 중 (Thinking or Calculating)&gt;을 교실에서 돌리는 웹앱입니다. **고등학교만.** 질문하기 → 탐구하기 → 쓰기.

현장 사진: IMG_8969–8994.

## 주소

배포 후 이 칸을 채웁니다.

로컬: `python -m http.server 8766` 후 http://127.0.0.1:8766  
챗 API는 Vercel에 올렸을 때만 GPT가 붙습니다. 로컬·키 없음이면 같은 화면이 로컬 꼬리질문으로 돕니다.

## 동선

| 주소 | 용도 |
|------|------|
| `#hub` | 세 걸음 + 다섯 자리 |
| `#ask` | 탐구질문카드 |
| `#inquire` | 자리 고르기 |
| `#inquire/calculate` | 계산인가 (다음 칸) |
| `#inquire/focus` | 재어지나 (숫자·그림·10초) |
| `#inquire/pose` | 몸인가 (평온/긴장) |
| `#inquire/types` | 자세 16 |
| `#chat` | 되물음 |
| `#write` | 활동지 3장 인쇄 |
| `#guide` | 교사용 |

모둠은 **한 자리만**. 미터가 탐구 자료입니다.

## GPT

Vercel 프로젝트 환경변수:

- `OPENAI_API_KEY` (나중에 넣으면 됨)
- `OPENAI_MODEL` (없으면 `gpt-4o-mini`)

시스템 프롬프트는 정의를 내리지 않고 꼬리질문만 합니다.

## 검사

`node scripts/check.mjs`
