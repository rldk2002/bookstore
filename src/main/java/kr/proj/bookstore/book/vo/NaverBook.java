package kr.proj.bookstore.book.vo;

import com.fasterxml.jackson.annotation.JsonView;
import kr.proj.bookstore.book.validation.BookViewModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NaverBook {
    // 책 제목
    @JsonView(BookViewModel.CoverImageOnly.class)
    private String title;

    // 네이버 도서 정보 URL
    private String link;

    // 섬네일 이미지의 URL
    @JsonView(BookViewModel.CoverImageOnly.class)
    private String image;

    // 저자 이름
    private String author;

    // 정가
    private String price;

    // 할인 가격
    private String discount;

    // 출판사
    private String publisher;

    // ISBN
    @JsonView(BookViewModel.CoverImageOnly.class)
    private String isbn;

    // 네이버 도서의 책 소개
    private String description;

    // 출간일
    private String pubdate;
}
