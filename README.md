# README

# 미션 1. 기획 및 설계

## 1. Frontend 미니프로젝트 분석

기존 React 기반 도서 관리 프로젝트를 분석하였다.

- db.json 데이터 구조 분석
- fetch 기반 API 호출 패턴 분석
- 도서 목록 조회 기능 확인
- 도서 상세 조회 기능 확인
- 도서 등록 기능 확인
- 도서 수정 기능 확인
- 도서 삭제 기능 확인

---

## 2. ERD 설계

Book Entity를 중심으로 데이터 구조를 설계하였다.
---
| 필드명           | 타입            | 설명     |
|---------------|---------------|--------|
| id            | Long          | 도서 ID  |
| title         | String        | 제목     |
| author        | String        | 저자     |
| publisher     | String        | 출판사    |
| publishDate   | LocalDate     | 출판일    |
| genres        | List<String>  | 장르     |
| description   | String        | 도서 소개  |
| content       | String        | 도서 내용  |
| tags          | List<String>  | 태그     |
| coverImageUrl | String        | 표지 이미지 |
| createdAt     | LocalDateTime | 생성일    |
| updatedAt     | LocalDateTime | 수정일    |

---

## 3. API 명세 설계

Frontend 호출 패턴에 맞추어 API를 설계하였다.

| Method | URL               | 기능        |
|--------|-------------------|-----------|
| GET    | /books            | 전체 조회     |
| GET    | /books/{id}       | 상세 조회     |
| POST   | /books            | 도서 등록     |
| PATCH  | /books/{id}       | 도서 수정     |
| DELETE | /books/{id}       | 도서 삭제     |
| PATCH  | /books/{id}/cover | 표지 이미지 저장 |

---

## 4. 역할 분담

- Domain 계층 구현
- Repository 계층 구현
- Service 계층 구현
- Controller 계층 구현 및 통합 테스트

---

# 미션 2. 환경 설정 및 계층 골격 작성

## 1. 프로젝트 생성

Spring Initializer를 사용하여 프로젝트를 생성하였다.

- Group : com.aivle
- Artifact : book app

---

## 2. Domain 계층

Book Entity를 생성하였다.

주요 어노테이션

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
```

---

## 3. Repository 계층

BookRepository를 생성하였다.

```java
public interface BookRepository extends JpaRepository<Book, Long> {
}
```

---

## 4. Service 계층

BookService 골격을 작성하였다.

구현 예정 기능

- 전체 조회
- 상세 조회
- 등록
- 수정
- 삭제

---

## 5. Controller 계층

BookController 골격을 작성하였다.

API 엔드포인트 설계

```text
GET /books
GET /books/{id}
POST /books
PATCH /books/{id}
DELETE /books/{id}
```

---

## 6. WebConfig 설정

Frontend와 Backend 연동을 위해 CORS 설정을 적용하였다.

---

## 7. application.yml 설정

- H2 Database 사용
- JPA 설정 적용
- H2 Console 활성화

---

## 8. Git 저장소 생성

Git 저장소를 생성하고 초기 커밋을 수행하였다.

---

# 미션 3. Repository + Service + GET API 구현

## 1. Repository CRUD 검증

JpaRepository 기반 CRUD 기능을 확인하였다.

---

## 2. Service 구현

조회 기능을 구현하였다.

```java
findAll();
findById();
```

---

## 3. Controller 구현

### 전체 조회

```http
GET /books
```

### 상세 조회

```http
GET /books/{id}
```

---

## 4. H2 Console 확인

```text
http://localhost:8080/h2-console
```

접속 후 데이터 저장 여부를 확인하였다.

---

## 5. Frontend 1차 연동

React Fetch URL을 Spring Boot API로 변경하였다.

```javascript
http://localhost:8080/books
```

---

## 6. 통합 테스트

다음 기능을 정상 확인하였다.

- 전체 조회 성공
- 상세 조회 성공
- React 화면 조회 성공

---

# 미션 4. POST / PATCH / DELETE + 검증

## 1. 입력 검증 추가

Book Entity에 Validation을 적용하였다.

```java
@NotBlank
private String title;

@NotBlank
private String author;
```

---

## 2. 등록 기능 구현

```http
POST /books
```

구현 완료

---

## 3. 수정 기능 구현

```http
PATCH /books/{id}
```

구현 완료

---

## 4. 삭제 기능 구현

```http
DELETE /books/{id}
```

구현 완료

---

## 5. 풀스택 CRUD 검증

### Postman 테스트

다음 기능을 확인하였다.

- 전체 조회
- 상세 조회
- 등록
- 수정
- 삭제

### React 화면 테스트

다음 기능을 확인하였다.

- 도서 목록 조회
- 도서 상세 조회
- 도서 등록
- 도서 수정
- 도서 삭제

---

## 6. 최종 결과

React Frontend와 Spring Boot Backend를 연동하여 CRUD 기능이 정상 동작함을 확인하였다.

- Frontend ↔ Backend 연동 성공
- H2 Database 저장 확인
- Postman API 검증 완료
- React UI 검증 완료

# 미션 5. 사용자 정의 예외 + @Transactional

## 1. 사용자 정의 예외 생성

BookNotFoundException 클래스를 생성하였다.

```java
public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(Long id) {
        super("Book not found: id=" + id);
    }
}
```

---

## 2. 상세 조회 예외 처리

존재하지 않는 도서를 조회할 경우 예외가 발생하도록 구현하였다.

```java
@Transactional(readOnly = true)
public Book findById(Long id) {
    return bookRepository.findById(id)
            .orElseThrow(() -> new BookNotFoundException(id));
}
```

---

## 3. @Transactional 적용

조회 기능에는 읽기 전용 트랜잭션을 적용하였다.

```java
@Transactional(readOnly = true)
```

적용 메서드

- findAll()
- findById()
- count()
- searchByTitle()
- searchByKeyword()
- searchByTitleAndAuthor()
- authorGetTitle()
- getPage()

---

등록, 수정, 삭제 기능에는 일반 트랜잭션을 적용하였다.

```java
@Transactional
```

적용 메서드

- create()
- update()
- updateCover()
- deleteBook()

---

## 4. 테스트 결과

존재하지 않는 ID 조회 시 BookNotFoundException이 정상 발생하는 것을 확인하였다.

예시

```http
GET /books/999999
```

---

# 미션 6. 전역 예외 처리 (@RestControllerAdvice)

## 1. GlobalExceptionHandler 생성

전역 예외 처리 클래스를 작성하였다.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
}
```

---

## 2. 도서 없음 예외 처리

BookNotFoundException 발생 시 404 상태 코드를 반환하도록 구현하였다.

```java
@ExceptionHandler(BookNotFoundException.class)
public ResponseEntity<Map<String, String>> handleNotFound(
        BookNotFoundException e) {

    Map<String, String> body = Map.of(
            "error", "Book not found",
            "message", e.getMessage()
    );

    return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(body);
}
```

---

## 3. 검증 실패 예외 처리

입력값 검증 실패 시 400 상태 코드를 반환하도록 구현하였다.

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, String>> handleValidation(
        MethodArgumentNotValidException e) {

    String msg = e.getBindingResult()
            .getFieldError()
            .getDefaultMessage();

    Map<String, String> body = Map.of(
            "error", "Validation failed",
            "message", msg
    );

    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(body);
}
```

---

## 4. Postman 테스트

### 존재하지 않는 도서 조회

요청

```http
GET /books/999999
```

응답

```json
{
  "error": "Book not found",
  "message": "Book not found: id=999999"
}
```

상태 코드

```text
404 Not Found
```

---

### 검증 실패 테스트

요청

```json
{
  "title": "",
  "author": ""
}
```

응답

```json
{
  "error": "Validation failed",
  "message": "공백일 수 없습니다"
}
```

상태 코드

```text
400 Bad Request
```

---

## 5. 최종 결과

전역 예외 처리 적용을 통해 모든 Controller의 예외를 일관성 있게 처리할 수 있도록 구현하였다.

- 사용자 정의 예외 처리 완료
- 404 응답 처리 완료
- 400 응답 처리 완료
- Postman 검증 완료
- React 화면 검증 완료
