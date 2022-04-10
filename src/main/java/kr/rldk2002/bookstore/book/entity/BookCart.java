package kr.rldk2002.bookstore.book.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BookCart {
    private int itemId;
    private int count;
    private String memberNo;
    private LocalDateTime timestamp;

    public BookCart(int itemId, int count, String memberNo) {
        this.itemId = itemId;
        this.count = count;
        this.memberNo = memberNo;
    }
}
