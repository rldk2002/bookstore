package kr.proj.bookstore.security.jwt;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtToken {
    private String accessToken;
    private String refreshToken;

    public JwtToken(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

}
