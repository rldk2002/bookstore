package kr.rldk2002.bookstore.security;

import kr.rldk2002.bookstore.member.Member;
import kr.rldk2002.bookstore.member.validation.MemberGroupMarker;
import kr.rldk2002.bookstore.security.jwt.JwtAuthenticationService;
import kr.rldk2002.bookstore.security.jwt.JwtToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private static final int REFRESH_TOKEN_EXPIRE_TIME = 60 * 60 * 24 * 7;  // 7일
    private final JwtAuthenticationService authenticationService;

    @PostMapping("/login/jwt")
    public Map<String, Object> jwtLogin(
            @Validated(MemberGroupMarker.LoginForm.class) @ModelAttribute Member member,
            BindingResult bindingResult,
            HttpServletResponse response
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        JwtToken token = authenticationService.login(member.getId(), member.getPassword());

        Cookie cookie = new Cookie("Authorization", token.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(REFRESH_TOKEN_EXPIRE_TIME);
        response.addCookie(cookie);

        log.debug("[ JWT Form 로그인 성공 ] id: {}", member.getId());
        return Map.of("Authorization", token.getAccessToken());
    }



}
