package kr.rldk2002.bookstore.book;

import kr.rldk2002.bookstore.book.entity.InterparkBookResult;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class BookControllerAdvice {

//    @ExceptionHandler(InterparkBookServerMaintenanceException.class)
//    public InterparkBookResult handleServerMaintenance(Exception exception) {
//        System.out.println(exception.getMessage());
//        InterparkBookResult result = new InterparkBookResult();
//        result.setReturnCode("###");
//        return result;
//    }
}
