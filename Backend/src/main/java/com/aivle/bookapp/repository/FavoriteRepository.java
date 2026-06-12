package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.Favorite;
import com.aivle.bookapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    @Modifying
    @Query(value = """
            INSERT INTO users (user_id, username, email)
            VALUES (:userId, COALESCE(:email, :userId), :email)
            ON CONFLICT (user_id) DO UPDATE
            SET username = COALESCE(users.username, EXCLUDED.username),
                email = COALESCE(EXCLUDED.email, users.email)
            """, nativeQuery = true)
    void upsertUser(@Param("userId") String userId, @Param("email") String email);

    @Modifying
    @Query(value = """
            INSERT INTO favorite (id, user_id, book_id)
            SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM favorite), :userId, :bookId
            WHERE NOT EXISTS (
                SELECT 1 FROM favorite
                WHERE user_id = :userId AND book_id = :bookId
            )
            """, nativeQuery = true)
    int insertFavoriteIfAbsent(@Param("userId") String userId, @Param("bookId") Long bookId);

    @Modifying
    @Query(value = """
            DELETE FROM favorite
            WHERE user_id = :userId AND book_id = :bookId
            """, nativeQuery = true)
    int deleteByUserIdAndBookId(@Param("userId") String userId, @Param("bookId") Long bookId);
}
