package kr.rldk2002.bookstore.security.userdetails;

import kr.rldk2002.bookstore.member.Member;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;

public class User implements UserDetails {
    @Getter
    private String no;

    @Getter
    private String id;

    private String password;
    private Set<SimpleGrantedAuthority> roles;

    @Getter
    private Set<AccountStatus> statuses;

    public User(Member member) {
        Objects.requireNonNull(member, "회원정보가 null 입니다.");

        this.no = member.getNo();
        this.id = member.getId();
        this.password = member.getPassword();
        this.roles = member.getRoles();
        this.statuses = member.getStatuses();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    @Deprecated
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return id;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !statuses.contains(AccountStatus.ACCOUNT_EXPIRED);
    }

    @Override
    public boolean isAccountNonLocked() {
        return !statuses.contains(AccountStatus.ACCOUNT_LOCKED);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !statuses.contains(AccountStatus.CREDENTIALS_EXPIRED);
    }

    @Override
    public boolean isEnabled() {
        return !statuses.contains(AccountStatus.DISABLED);
    }
}
