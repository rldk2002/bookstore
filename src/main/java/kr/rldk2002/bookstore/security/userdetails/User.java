package kr.rldk2002.bookstore.security.userdetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Getter
    private String name;

    private String password;
    private Set<SimpleGrantedAuthority> roles;

    @Getter
    @JsonIgnore
    private Set<AccountStatus> statuses;

    public User(Member member) {
        Objects.requireNonNull(member, "회원정보가 null 입니다.");

        this.no = member.getNo();
        this.id = member.getId();
        this.name = member.getName();
        this.password = member.getPassword();
        this.roles = member.getRoles();
        this.statuses = member.getStatuses();
    }


    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    @Deprecated
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return id;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return !statuses.contains(AccountStatus.ACCOUNT_EXPIRED);
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return !statuses.contains(AccountStatus.ACCOUNT_LOCKED);
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return !statuses.contains(AccountStatus.CREDENTIALS_EXPIRED);
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return !statuses.contains(AccountStatus.DISABLED);
    }
}
