package com.aivle.bookapp;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BookappApplication {

	@Bean
	CommandLineRunner init(BookRepository bookRepository) {
		return args -> {
			// H2/Supabase 모두에서 중복 샘플 데이터가 쌓이지 않도록 최초 1회만 저장
			if (bookRepository.count() > 0) {
				return;
			}

			Book b1 = new Book();
			b1.setTitle("자바의 정석");
			b1.setAuthor("남궁성");
			bookRepository.save(b1);

			Book b2 = new Book();
			b2.setTitle("Spring 입문");
			b2.setAuthor("임한울");
			bookRepository.save(b2);

			Book b3 = new Book();
			b3.setTitle("React 시작");
			b3.setAuthor("홍길동");
			bookRepository.save(b3);

			Book b4 = new Book();
			b4.setTitle("자바의 기초");
			b4.setAuthor("임한울");
			bookRepository.save(b4);

			Book b5 = new Book();
			b5.setTitle("Node.js 실전");
			b5.setAuthor("김에이블");
			bookRepository.save(b5);
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(BookappApplication.class, args);
	}
}
