package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.exception.BookNotFoundException;
import com.aivle.bookapp.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public Book findById(Long id) {
        return bookRepository.findById(id).orElseThrow(()
                -> new BookNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Transactional
    public void deleteBook(Long id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
        } else {
            throw new BookNotFoundException(id);
        }
    }

    @Transactional(readOnly = true)
    public long count() {
        return bookRepository.count();
    }

    @Transactional(readOnly = true)
    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitle(title);
    }

    @Transactional(readOnly = true)
    public List<Book> searchByKeyword(String keyword) {
        return bookRepository.findByTitleContaining(keyword);
    }

    @Transactional(readOnly = true)
    public List<Book> searchByTitleAndAuthor(String title, String author) {
        return bookRepository.findByTitleAndAuthor(title, author);
    }

    @Transactional(readOnly = true)
    public List<String> authorGetTitle(String author) {
        List<Book> books = bookRepository.findByAuthor(author);

        return books.stream().map(book -> book.getTitle()).toList();
    }

    @Transactional(readOnly = true)
    public Page<Book> getPage(int page, int size, String sortBy) {
        Sort sort = Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return bookRepository.findAll(pageable);
    }

    @Transactional
    public Book create(Book book) {
        LocalDateTime now = LocalDateTime.now();
        book.setCreatedAt(now);
        book.setUpdatedAt(now);
        return bookRepository.save(book);
    }

    @Transactional
    public Book update(Long id, Book book) {
        Book existing = findById(id);

        if (book.getTitle() != null) {
            existing.setTitle(book.getTitle());
        }
        if (book.getAuthor() != null) {
            existing.setAuthor(book.getAuthor());
        }
        if (book.getPublisher() != null) {
            existing.setPublisher(book.getPublisher());
        }
        if (book.getPublishDate() != null) {
            existing.setPublishDate(book.getPublishDate());
        }
        if (book.getGenres() != null) {
            existing.setGenres(book.getGenres());
        }
        if (book.getDescription() != null) {
            existing.setDescription(book.getDescription());
        }
        if (book.getContent() != null) {
            existing.setContent(book.getContent());
        }
        if (book.getTags() != null) {
            existing.setTags(book.getTags());
        }
        if (book.getCoverImageUrl() != null) {
            existing.setCoverImageUrl(book.getCoverImageUrl());
        }

        existing.setUpdatedAt(LocalDateTime.now());

        return bookRepository.save(existing);
    }

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
}











