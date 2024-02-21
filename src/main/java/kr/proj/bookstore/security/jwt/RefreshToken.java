package kr.proj.bookstore.security.jwt;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshToken {
    private String memberNo;
    private String ip;
    private String refreshToken;
}
