package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.Favorite;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.exception.BookNotFoundException;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.repository.FavoriteRepository;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

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

        User user = findOrCreateUser(userId, email);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        // 중복 등록 방지 체크
        if (favoriteRepository.findByUserAndBook(user, book).isEmpty()) {
            favoriteRepository.save(new Favorite(user, book));
        }
    }

    /**
     * [기능 4] 즐겨찾기 삭제 (DELETE)
     */
    @Transactional
    public void removeFavorite(String userId, Long bookId) {
        validateUserId(userId);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        favoriteRepository.findByUserIdAndBookId(userId, book.getId())
                .ifPresent(favoriteRepository::delete);
    }

    private User findOrCreateUser(String userId, String email) {
        return userRepository.findById(userId)
                .orElseGet(() -> {
                    User user = new User();
                    user.setId(userId);
                    user.setEmail(email);
                    return userRepository.save(user);
                });
    }

    private void validateUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId가 누락되었습니다.");
        }
    }
}
