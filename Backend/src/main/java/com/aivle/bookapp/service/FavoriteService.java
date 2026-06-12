package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.exception.BookNotFoundException;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final BookRepository bookRepository;

    /**
     *  [기능 1] 즐겨찾기 ID 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Long> getFavoriteBookIds(String userId) {
        validateUserId(userId);

        return favoriteRepository.findBookIdsByUserId(userId);
    }

    /**
     * [기능 2] 즐겨찾기 도서 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Book> getFavoriteBooks(String userId) {
        validateUserId(userId);

        return favoriteRepository.findBooksByUserId(userId);
    }

    /**
     * [기능 3] 즐겨찾기 추가 (POST)
     */
    @Transactional
    public void addFavorite(String userId, String email, Long bookId) {
        validateUserId(userId);

        if (!bookRepository.existsById(bookId)) {
            throw new BookNotFoundException(bookId);
        }

        // Supabase 로그인 유저를 우리 users 테이블에도 맞춰 둔다
        favoriteRepository.upsertUser(userId, email);

        // 이미 누른 하트면 조용히 넘어간다
        favoriteRepository.insertFavoriteIfAbsent(userId, bookId);
    }

    /**
     * [기능 4] 즐겨찾기 삭제 (DELETE)
     */
    @Transactional
    public void removeFavorite(String userId, Long bookId) {
        validateUserId(userId);

        if (!bookRepository.existsById(bookId)) {
            throw new BookNotFoundException(bookId);
        }

        favoriteRepository.deleteByUserIdAndBookId(userId, bookId);
    }

    private void validateUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId가 누락되었습니다.");
        }
    }
}
