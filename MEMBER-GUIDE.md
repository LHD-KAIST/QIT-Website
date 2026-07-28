# 멤버 셀프 편집 가이드 (사진 · 소개 넣기)

이 문서는 QIT 그룹 구성원이 **자기 사진과 소개를 직접** 웹사이트에 넣는 방법입니다.
프로그래밍 지식 · 터미널 필요 없습니다. 전부 GitHub 웹에서 클릭으로 합니다.

- 저장소: **https://github.com/LHD-KAIST/QIT-Website**
- 커밋(저장)하면 **1~2분 뒤 사이트에 자동 반영**됩니다.
- 준비물: GitHub 계정. (저장소 편집 권한이 없으면 관리자에게 요청하세요.)

> 🛡️ **안심하세요.** 혹시 실수로 형식을 틀려도 사이트는 절대 안 깨집니다.
> 잘못된 편집은 "반영이 안 될 뿐"이고, 기존 사이트는 그대로 유지됩니다.

---

## 내 ID 확인 (사진 파일 이름에 씀)

| 이름 | 내 ID |
|---|---|
| Changhun Oh | `oh-changhun` |
| Chandan Kumar | `kumar-chandan` |
| Minsoo Kim | `kim-minsoo` |
| Sojeong Park | `park-sojeong` |
| Jiwon Heo | `heo-jiwon` |
| Vaughan Sohn | `sohn-vaughan` |
| Eugen Coroi | `coroi-eugen` |
| Eunbin Yang | `yang-eunbin` |
| Hyeongu Kang | `kang-hyeongu` |
| Hodong Lee | `lee-hodong` |
| Myeongjin Shin | `shin-myeongjin` |
| Sangwoo Jeon | `jeon-sangwoo` |

---

## A. 내 사진 올리기

1. 저장소에서 **`public/images/people/`** 폴더로 들어갑니다.
2. 오른쪽 위 **Add file → Upload files** 클릭.
3. 사진 파일 이름을 **`내ID.jpg`** 로 바꿔서 끌어다 올립니다.
   예) Hodong Lee → **`lee-hodong.jpg`**
   - `.jpg`, `.png`, `.webp` 다 됩니다. 확장자만 맞으면 형식은 상관없어요.
4. 아래 **Commit changes** 클릭.
5. 끝. 잠시 뒤 People 페이지 내 카드에 사진이 뜹니다. (그전엔 무늬 플레이스홀더)

**사진 팁:** 세로형(증명사진 느낌) · 가로 800px 이상 · 5MB 이하 권장.

---

## B. 내 소개 수정

1. 저장소에서 **`src/data/members.json`** 파일을 엽니다.
   > 💡 팁: 저장소 화면에서 키보드 **`.`(마침표)** 를 누르면 색깔이 표시되는 편집기가 열려 훨씬 안전합니다.
2. 연필(✏️ Edit) 아이콘 클릭 → **Ctrl+F** 로 본인 이름을 찾습니다.
3. **본인 블록 `{ ... }` 안에서만** 아래 항목의 값을 고칩니다.

| 항목 | 뜻 | 예시 |
|---|---|---|
| `bio` | 한 줄 소개 | `"I study classical simulation of quantum circuits."` (없으면 `null`) |
| `interests` | 관심 분야 목록 | `["Boson sampling", "Quantum simulation"]` |
| `title` | 직함 | `"Assistant Professor"` (학생은 보통 `null`) |
| `education` | 학력·경력 | `[{ "period": "2024 – present", "position": "Ph.D. student", "org": "KAIST" }]` |
| `links` | 외부 링크 | `{ "scholar": "https://...", "website": "https://...", "arxiv": null, "orcid": null }` |
| `emails` | 이메일 | `[{ "user": "myid", "domain": "kaist.ac.kr", "primary": true }]` |

4. 다 고쳤으면 아래 **Commit changes** 클릭.

**개인 홈페이지 버튼:** `links` 안 `"website"` 에 주소를 넣으면, 사진 아래에
"Personal Homepage" 버튼이 자동으로 생깁니다. (원하는 사람만 넣으면 됩니다.)

---

## ⚠️ JSON 편집 규칙 (딱 3가지만 지키면 됩니다)

1. **따옴표 `" "` 안의 글자만** 바꾸세요.
2. 쉼표 `,` · 중괄호 `{ }` · 대괄호 `[ ]` 를 **지우거나 빠뜨리지 마세요.**
3. **본인 블록만** 고치세요. 남의 정보는 건드리지 않습니다.

가장 안전한 방법: 옆 사람 블록을 참고해서 **형식을 똑같이 맞추는 것**.

---

## 잘 안 될 때

- 반영이 2분 넘게 안 되면 형식 오류일 가능성이 큽니다. 관리자에게 알리거나,
  방금 본인이 편집한 것을 저장소의 **History** 에서 되돌리면 원래대로 돌아옵니다.
- JSON 편집이 부담되면, **사진과 소개 내용을 관리자에게 보내** 대신 넣어달라고
  해도 됩니다.
