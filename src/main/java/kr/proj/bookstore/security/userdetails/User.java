package kr.proj.bookstore.security.userdetails;

import kr.proj.bookstore.member.vo.Member;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class User implements UserDetails {
    private String no;
    private String id;
    private String password;
    private String name;
    private String phoneNumber;
    private Set<SimpleGrantedAuthority> roles;
    private Status status;

    public User(Member member) {
        this.no = member.getNo();
        this.id = member.getId();
        this.password = member.getPassword();
        this.name = member.getName();
        this.phoneNumber = member.getPhoneNumber();
        this.roles = convertRoleToSimpleGrantedAuthority(member.getRoles());
        this.status = member.getStatus();
    }

    public User(String no, String id, String name, Set<SimpleGrantedAuthority> roles, Status status) {
        this.no = no;
        this.id = id;
        this.name = name;
        this.roles = roles;
        this.status = status;
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
    @Deprecated
    public String getUsername() {
        return id;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !status.isAccountExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !status.isAccountLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !status.isCredentialsExpired();
    }

    @Override
    public boolean isEnabled() {
        return status.isEnabled();
    }

    protected Set<SimpleGrantedAuthority> convertRoleToSimpleGrantedAuthority(Set<Role> roles) {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority(role.getRole()))
            .collect(Collectors.toSet());
    }
}
