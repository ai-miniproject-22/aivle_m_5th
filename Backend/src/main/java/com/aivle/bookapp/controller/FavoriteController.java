package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * 1. 즐겨찾기 ID 목록 조회
     */
    @GetMapping("/favorites/book-ids")
    public ResponseEntity<List<Long>> getFavoriteBookIds(@RequestParam("userId") String userId) {
        List<Long> bookIds = favoriteService.getFavoriteBookIds(userId);
        return ResponseEntity.ok(bookIds);
    }

    /**
     * 2. 즐겨찾기 도서 목록 조회
     */
    @GetMapping("/favorites")
    public ResponseEntity<List<Book>> getFavoriteList(@RequestParam("userId") String userId) {
        List<Book> favoriteBooks = favoriteService.getFavoriteBooks(userId);
        return ResponseEntity.ok(favoriteBooks);
    }

    /**
     * 3. 즐겨찾기 추가
     */
    @PostMapping("/books/{bookId}/favorites")
    public ResponseEntity<Void> addFavorite(
            @PathVariable("bookId") Long bookId,
            @RequestBody Map<String, Object> body) {

        Object userIdValue = body.get("userId");
        String userId = userIdValue == null ? null : String.valueOf(userIdValue);
        String email = body.get("email") == null ? null : String.valueOf(body.get("email"));

        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId가 누락되었습니다.");
        }

        favoriteService.addFavorite(userId, email, bookId);
        return ResponseEntity.status(HttpStatus.CREATED).build(); // 201 Created
    }

    /**
     * 4. 즐겨찾기 삭제
     */
    @DeleteMapping("/books/{bookId}/favorites")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable("bookId") Long bookId,
            @RequestParam("userId") String userId) {

        favoriteService.removeFavorite(userId, bookId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
