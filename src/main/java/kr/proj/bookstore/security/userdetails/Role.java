package kr.proj.bookstore.security.userdetails;

import lombok.Getter;

@Getter
public enum Role {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private String role;

    Role(String role) {
        this.role = role;
    }
}
