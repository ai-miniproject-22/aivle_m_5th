# AI Mini Project 5th - Book App

React 프론트엔드와 Spring Boot 백엔드로 구성한 도서 관리 시스템입니다.

## Project Structure

```text
Frontend/  React + Vite client
Backend/   Spring Boot API server
```

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

## Main API

```text
GET    /books
GET    /books/{id}
POST   /books
PATCH  /books/{id}
DELETE /books/{id}
PATCH  /books/{id}/cover
```
