package kr.proj.bookstore.member.validation;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = UniqueValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Unique {
    String message() default "이미 사용중인 값입니다.";
    String field();
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
