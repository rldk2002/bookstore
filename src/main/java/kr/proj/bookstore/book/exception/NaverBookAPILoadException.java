package kr.proj.bookstore.book.exception;

import lombok.Getter;

@Getter
public class NaverBookAPILoadException extends RuntimeException {
    private String code;

    public NaverBookAPILoadException(String code, String msg) {
        super(msg);
        this.code = code;
    }
}
