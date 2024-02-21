package kr.proj.bookstore.support;

import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;

@Slf4j
public class ValidationLogPrinter {

    public static void print(BindingResult bindingResult) {
        log.debug("========== 데이터 유효성 검증 실패 ==========");
        bindingResult.getAllErrors().stream().forEach(objectError -> {
            log.debug("데이터 유효성 검증 실패: {}.{} - {}", objectError.getObjectName(), objectError.getCode(), objectError.getDefaultMessage());
        });
        log.debug("==========// 데이터 유효성 검증 실패 ==========");
    }
}
