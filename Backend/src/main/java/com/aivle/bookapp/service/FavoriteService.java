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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        return favoriteRepository.findBookIdsByUser(user);
    }

    /**
     * [기능 2] 즐겨찾기 도서 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Book> getFavoriteBooks(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        List<Favorite> favorites = favoriteRepository.findByUser(user);
        return favorites.stream().map(Favorite::getBook).toList();
    }

    /**
     * [기능 3] 즐겨찾기 추가 (POST)
     */
    @Transactional
    public void addFavorite(String userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        Favorite favorite = favoriteRepository.findByUserAndBook(user, book)
                .orElseThrow(() -> new IllegalArgumentException("즐겨찾기 내역을 찾을 수 없습니다."));

        favoriteRepository.delete(favorite);
    }
}