package kr.rldk2002.bookstore.book.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookLike {
    private String memberNo;
    private int itemId;
    private LocalDateTime timestamp;
}
