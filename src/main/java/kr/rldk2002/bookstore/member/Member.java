package kr.rldk2002.bookstore.member;

import kr.rldk2002.bookstore.member.validation.MemberGroupMarker.LoginForm;
import kr.rldk2002.bookstore.member.validation.MemberGroupMarker.SignUp;
import kr.rldk2002.bookstore.member.validation.Unique;
import kr.rldk2002.bookstore.security.userdetails.AccountStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class Member {
    private String no;

    @NotBlank(groups = { LoginForm.class, SignUp.class })
    @Size(min = 6, max = 20, groups = { SignUp.class })
    @Pattern(regexp = "^[a-z0-9_-]*$", groups = { SignUp.class })
    @Unique(groups = { SignUp.class })
    private String id;

    @NotBlank(groups = { LoginForm.class, SignUp.class })
    @Size(min = 8, max = 24, groups = { SignUp.class })
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]*$", groups = { SignUp.class })
    private String password;

    @NotBlank(groups = { SignUp.class })
    @Size(min = 2, max = 12, groups = { SignUp.class })
    @Pattern(regexp = "^[가-힣a-zA-Z0-9]*$", groups = { SignUp.class })
    private String name;

    private LocalDateTime creationDate;
    private LocalDateTime deletionDate;
    private Set<SimpleGrantedAuthority> roles;
    private Set<AccountStatus> statuses;
}
