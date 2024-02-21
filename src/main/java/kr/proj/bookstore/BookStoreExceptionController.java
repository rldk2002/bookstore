package kr.proj.bookstore;

import kr.proj.bookstore.book.exception.NaverBookAPILoadException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class BookStoreExceptionController {

    @ExceptionHandler(NaverBookAPILoadException.class)
    public ResponseEntity<?> notFoundException(NaverBookAPILoadException exception) {
        exception.printStackTrace();
        return ResponseEntity.internalServerError().body(exception.getCode());
    }
}
