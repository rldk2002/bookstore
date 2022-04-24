package kr.rldk2002.bookstore.support;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseResult {
    private String code;
    private String message;
    private Object content;

    public ResponseResult(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
