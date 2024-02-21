package kr.proj.bookstore.support;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseResult {
    private String code;
    private Object payload;
    private String message;

    public ResponseResult(String code, Object payload) {
        this.code = code;
        this.payload = payload;
    }

    public ResponseResult(String code, Object payload, String message) {
        this.code = code;
        this.payload = payload;
        this.message = message;
    }

    public static ResponseResult response(String code, Object payload) {
        return new ResponseResult(code, payload);
    }

    public static ResponseResult response(String code, Object payload, String message) {
        return new ResponseResult(code, payload, message);
    }

    public String toJson() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(this);
        return json;
    }
}
