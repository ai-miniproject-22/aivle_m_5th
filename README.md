# AI Mini Project 5th - Book App

React 프론트엔드와 Spring Boot 백엔드로 구성한 도서 관리 및 AI 표지 생성 시스템입니다.

도서 정보를 등록, 조회, 수정, 삭제할 수 있으며, AI를 활용해 도서 표지를 생성하고 해당 표지 URL과 태그를 저장할 수 있습니다.

---

## Project Structure

```text
Frontend/  React + Vite client
Backend/   Spring Boot API server
```

---

## Backend

IntelliJ IDEA에서 `Backend` 폴더를 열고 `BookappApplication`을 실행합니다.

```text
http://localhost:8080
```

H2 Console:

```text
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:bookdb
User Name: sa
Password: 1234
```

---

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Main API

```text
GET    /books
GET    /books/{id}
POST   /books
PATCH  /books/{id}
DELETE /books/{id}
PATCH  /books/{id}/cover
```

---

# Mission Progress

## Day 1 - 기획 및 설계

### Frontend 분석

기존 React 기반 도서 관리 프로젝트를 분석하였다.

- db.json 데이터 구조 분석
- fetch 기반 API 호출 패턴 분석
- 도서 목록 조회 기능 확인
- 도서 상세 조회 기능 확인
- 도서 등록, 수정, 삭제 흐름 확인
- AI 표지 생성 및 저장 흐름 확인

---

### ERD 설계

Book Entity를 기준으로 데이터 구조를 설계하였다.

```text
Book
- id
- title
- author
- publisher
- publishDate
- genres
- description
- content
- tags
- coverImageUrl
- createdAt
- updatedAt
```

---

### API 설계

Frontend 호출 패턴에 맞추어 API를 설계하였다.

```text
GET    /books
GET    /books/{id}
POST   /books
PATCH  /books/{id}
DELETE /books/{id}
PATCH  /books/{id}/cover
```

---

### 역할 분담

- Domain 계층 구현
- Repository 계층 구현
- Service 계층 구현
- Controller 계층 구현
- Frontend 연동 및 통합 테스트
- README 및 발표 자료 정리

---

## Day 2 - CRUD 구현 및 Frontend 연동

### Backend 계층 구현

Spring Boot 기반으로 다음 계층을 구현하였다.

```text
Domain
Repository
Service
Controller
Exception
Config
```

---

### Domain

`Book` Entity를 생성하였다.

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    private Long id;
    private String title;
    private String author;
    private String publisher;
    private LocalDate publishDate;
    private List<String> genres;
    private String description;
    private String content;
    private List<String> tags;
    private String coverImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

---

### Repository

`JpaRepository`를 상속하여 기본 CRUD 기능을 사용할 수 있도록 구현하였다.

```java
public interface BookRepository extends JpaRepository<Book, Long> {
}
```

---

### Service

도서 조회, 등록, 수정, 삭제 기능을 구현하였다.

주요 메서드:

```text
findAll()
findById()
create()
update()
deleteBook()
updateCover()
```

---

### Controller

Frontend에서 호출할 REST API를 구현하였다.

```text
GET    /books
GET    /books/{id}
POST   /books
PATCH  /books/{id}
DELETE /books/{id}
PATCH  /books/{id}/cover
```

---

### Frontend 연동

React의 API 호출 URL을 Spring Boot 서버로 변경하였다.

```javascript
const BASE_URL = 'http://localhost:8080/books';
```

---

### 통합 테스트 결과

- 전체 조회 성공
- 상세 조회 성공
- 도서 등록 성공
- 도서 수정 성공
- 도서 삭제 성공
- React 화면 연동 성공
- H2 Database 저장 확인

---

## Day 3 - 예외 처리 및 Validation

### 사용자 정의 예외 처리

존재하지 않는 도서를 조회할 경우 `BookNotFoundException`이 발생하도록 구현하였다.

```java
public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(Long id) {
        super("Book not found: id=" + id);
    }
}
```

---

### Service 예외 처리

상세 조회 시 존재하지 않는 ID가 들어오면 예외를 발생시킨다.

```java
@Transactional(readOnly = true)
public Book findById(Long id) {
    return bookRepository.findById(id)
            .orElseThrow(() -> new BookNotFoundException(id));
}
```

---

### Transaction 적용

조회 메서드에는 읽기 전용 트랜잭션을 적용하였다.

```java
@Transactional(readOnly = true)
```

등록, 수정, 삭제 메서드에는 일반 트랜잭션을 적용하였다.

```java
@Transactional
```

---

### Validation 적용

도서 등록 시 제목과 저자는 필수값으로 검증되도록 설정하였다.

```java
@NotBlank
private String title;

@NotBlank
private String author;
```

Controller에서는 `@Valid`를 적용하였다.

```java
@PostMapping("/books")
public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
    Book saved = bookService.create(book);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}
```

---

### 전역 예외 처리

`@RestControllerAdvice`를 사용하여 Controller 예외를 일관성 있게 처리하였다.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
}
```

---

### 404 예외 처리

도서를 찾을 수 없는 경우 404 응답을 반환한다.

```java
@ExceptionHandler(BookNotFoundException.class)
public ResponseEntity<Map<String, String>> handleNotFound(BookNotFoundException e) {
    Map<String, String> body = Map.of(
            "error", "Book not found",
            "message", e.getMessage()
    );

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
}
```

---

### 400 예외 처리

입력값 검증 실패 시 400 응답을 반환한다.

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
    String msg = e.getBindingResult().getFieldError().getDefaultMessage();

    Map<String, String> body = Map.of(
            "error", "Validation failed",
            "message", msg
    );

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
}
```

---

### Postman 검증 결과

#### 존재하지 않는 도서 조회

Request:

```http
GET /books/999999
```

Response:

```json
{
  "error": "Book not found",
  "message": "Book not found: id=999999"
}
```

Status:

```text
404 Not Found
```

---

#### Validation 실패

Request:

```json
{
  "title": "",
  "author": ""
}
```

Response:

```json
{
  "error": "Validation failed",
  "message": "공백일 수 없습니다"
}
```

Status:

```text
400 Bad Request
```

---

## Day 4 - AI 표지 생성 흐름 구현

### AI 표지 저장 API 구현

AI가 생성한 표지 이미지 URL과 태그를 도서 정보에 저장하기 위한 API를 구현하였다.

```text
PATCH /books/{id}/cover
```

---

### Backend 구현

Controller에서 표지 저장 요청을 처리한다.

```java
@PatchMapping("/books/{id}/cover")
public Book updateBookCover(
        @PathVariable Long id,
        @RequestBody CoverUpdateRequest request
) {
    return bookService.updateCover(id, request.coverImageUrl(), request.tags());
}
```

---

### Service 구현

도서 ID를 기준으로 기존 도서를 조회한 뒤, 표지 이미지 URL과 태그를 업데이트한다.

```java
@Transactional
public Book updateCover(Long id, String coverImageUrl, List<String> tags) {
    Book existing = findById(id);

    existing.setCoverImageUrl(coverImageUrl);

    if (tags != null) {
        existing.setTags(tags);
    }

    existing.setUpdatedAt(LocalDateTime.now());

    return bookRepository.save(existing);
}
```

---

### Frontend 구현

Frontend에서 AI 표지 생성 후 Backend 저장 API를 호출하도록 구현하였다.

```javascript
export const updateBookCover = async (id, coverImageUrl, tags) => {
  const response = await fetch(`${BASE_URL}/${id}/cover`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      coverImageUrl,
      tags,
    }),
  });

  if (!response.ok) {
    throw new Error('표지 이미지 저장 실패');
  }

  return await response.json();
};
```

---

### AI 표지 생성 흐름

```text
React 화면에서 도서 정보 입력
        ↓
AI 표지 생성 버튼 클릭
        ↓
OpenAI Image API 호출
        ↓
생성된 표지 이미지 URL 반환
        ↓
React 화면에 표지 이미지 표시
        ↓
PATCH /books/{id}/cover 호출
        ↓
Spring Boot에서 coverImageUrl, tags 저장
        ↓
H2 Database 반영
```

---

### 검증 결과

- AI 표지 생성 버튼 동작 확인
- 생성된 표지 이미지 화면 표시 확인
- 표지 이미지 URL 저장 확인
- 태그 저장 확인
- 도서 상세 화면에서 저장된 표지 확인
- React → OpenAI → React → Backend 저장 흐름 확인

---

## 최종 결과

React Frontend와 Spring Boot Backend를 연동하여 도서 관리 및 AI 표지 생성 기능을 구현하였다.

완료 기능:

- 도서 전체 조회
- 도서 상세 조회
- 도서 등록
- 도서 수정
- 도서 삭제
- 입력값 검증
- 사용자 정의 예외 처리
- 전역 예외 처리
- AI 표지 생성
- AI 표지 URL 저장
- 태그 저장
- React 화면 연동
- Postman API 검증
- H2 Database 저장 확인
