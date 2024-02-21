package kr.proj.bookstore.member.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import kr.proj.bookstore.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UniqueValidator implements ConstraintValidator<Unique, String> {
    private final MemberService memberService;
    private String field;

    @Override
    public void initialize(Unique constraintAnnotation) {
        this.field = constraintAnnotation.field();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        switch (this.field) {
            case "id":
                return !memberService.hasMemberById(value);
            case "name":
                return !memberService.hasMemberByName(value);
            default:
                throw new IllegalArgumentException("조회하려는 Member의 field 이름이 잘못됨");
        }
    }
}
