package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.Favorite;
import com.aivle.bookapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserAndBook(User user, Book book);
    List<Favorite> findByUser(User user);

    // 추가 요건: 유저가 찜한 책들의 ID만 리스트로 빠르게 가져오는 JPQL 쿼리
    @Query("SELECT f.book.id FROM Favorite f WHERE f.user = :user")
    List<Long> findBookIdsByUser(@Param("user") User user);

    @Query("SELECT f.book.id FROM Favorite f WHERE f.user.id = :userId")
    List<Long> findBookIdsByUserId(@Param("userId") String userId);

    @Query("SELECT f.book FROM Favorite f WHERE f.user.id = :userId")
    List<Book> findBooksByUserId(@Param("userId") String userId);

    @Query("SELECT f FROM Favorite f WHERE f.user.id = :userId AND f.book.id = :bookId")
    Optional<Favorite> findByUserIdAndBookId(
            @Param("userId") String userId,
            @Param("bookId") Long bookId
    );
}
