# 📚 BookShelf (도서 관리 및 맞춤 추천 시스템)

도서 정보를 등록하고 AI가 생성한 맞춤형 표지를 함께 관리할 수 있는 스마트 도서 관리 시스템

## 🚀 실행 방법

본 프로젝트는 프론트엔드와 json-server를 동시에 실행해야 합니다.

### 1. 패키지 설치
npm install

### 2. 프론트엔드 앱 실행
npm run dev

### 3. JSON Server 실행
별도의 터미널을 열고 아래 명령어를 실행합니다.
npx json-server@0.17.4 --watch db.json

---

### ✨ 주요 기능

- **AI 기반 도서 표지 생성**
  - 사용자가 입력한 도서 제목과 소개를 기반으로 OpenAI Image API를 활용하여 도서 표지를 자동 생성합니다.
  - 스타일·색감·이미지 비율·품질 등을 옵션으로 선택할 수 있습니다.

- **AI 기반 자동 태깅**
  - 도서 소개를 분석해 OpenAI가 사전 정의된 후보 태그 중 어울리는 태그 3개를 자동으로 부여합니다.

- **도서 정보 관리 (CRUD)**
  - 도서 등록, 조회, 수정, 삭제 기능을 제공하여 도서 정보를 효율적으로 관리할 수 있습니다.

- **생성 이미지 및 태그 저장**
  - AI가 생성한 표지 이미지와 태그를 도서 정보와 함께 저장하고 재조회할 수 있습니다.

- **검색 및 장르 필터링**
  - 등록된 도서를 제목·저자로 검색하고, 장르별로 필터링하여 목록을 조회할 수 있습니다.

- **유사 도서 추천**
  - 도서 상세 페이지에서 같은 장르·태그를 가진 비슷한 책을 자동으로 추천합니다.

- **개인화 추천**
  - 사용자가 열어본 도서의 장르와 태그를 학습하여, 메인 페이지에 취향에 맞는 도서를 추천합니다.

- **입력 폼 유효성 검증**
  - 도서 등록 시 필수 항목을 검증하여 잘못된 데이터의 등록을 방지합니다.

- **직관적인 사용자 인터페이스**
  - 도서 등록부터 AI 표지 생성 및 저장까지 한 화면에서 수행할 수 있는 사용자 친화적인 UI를 제공합니다.

---

## 📸 화면 스크린샷

### 1. 메인 목록 화면
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/11a83a0d-6a66-47f6-8659-5f5c751c2577" />
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/f1b6603e-b9d2-46ed-b05b-1b1cd070b33c" />

### 2. 도서 상세 및 추천 화면
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/9e623c30-adbe-4e4e-bbb1-0ba9bbb4a84a" />
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/67cba749-0a4e-40e6-8aea-96926418de15" />

### 3. 수정 및 삭제 화면
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/89872293-60d1-4661-8afb-eeee19150f6d" />
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/ff01f3a6-cf9d-4279-84af-11f0b2c18906" />
