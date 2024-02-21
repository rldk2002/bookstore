package kr.proj.bookstore.book.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 책 찜하기
 */
@Getter
@Setter
public class BookDibs {
    private String isbn;
    private String memberNo;
    private LocalDateTime addedDate;
}
