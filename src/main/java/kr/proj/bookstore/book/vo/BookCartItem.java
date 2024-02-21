package kr.proj.bookstore.book.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookCartItem {
    private String memberNo;
    private String isbn;
    private int count;
    private LocalDateTime addedDate;
}
