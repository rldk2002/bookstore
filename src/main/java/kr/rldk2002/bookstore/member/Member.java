package kr.rldk2002.bookstore.member;

import kr.rldk2002.bookstore.member.validation.MemberGroupMarker.LoginForm;
import kr.rldk2002.bookstore.security.userdetails.AccountStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class Member {
    private String no;

    @NotBlank(groups = { LoginForm.class })
    private String id;

    @NotBlank(groups = { LoginForm.class })
    private String password;

    private String name;
    private LocalDateTime creationDate;
    private LocalDateTime deletionDate;
    private Set<SimpleGrantedAuthority> roles;
    private Set<AccountStatus> statuses;
}
