package kr.proj.bookstore.member.vo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import kr.proj.bookstore.member.validation.MemberValidationGroup.*;
import kr.proj.bookstore.member.validation.Unique;
import kr.proj.bookstore.security.userdetails.Role;
import kr.proj.bookstore.security.userdetails.Status;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class Member {
    private String no;

    @NotBlank(groups = { SignUp.class })
    @Size(min = 8, max = 20, groups = { SignUp.class })
    @Pattern(regexp = "^[a-zA-Z0-9_-]*$", groups = { SignUp.class })
    @Unique(field = "id", groups = { SignUp.class })
    private String id;

    @NotBlank(groups = { SignUp.class })
    @Size(min = 2, max = 20, groups = { SignUp.class })
    @Pattern(regexp = "^[가-힣a-zA-Z0-9]*$", groups = { SignUp.class })
    private String name;

    @NotBlank(groups = { SignUp.class })
    @Size(min = 1, max = 15, groups = { SignUp.class })
    @Pattern(regexp = "^[0-9]*$", groups = { SignUp.class })
    private String phoneNumber;

    @NotBlank(groups = { SignUp.class })
    @Size(min = 8, max = 24, groups = { SignUp.class })
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]*$", groups = { SignUp.class })
    private String password;

    private LocalDateTime createdDate;
    private Set<Role> roles;
    private Status status;
}
