package kr.rldk2002.bookstore.security;

import kr.rldk2002.bookstore.member.Member;
import kr.rldk2002.bookstore.member.validation.MemberGroupMarker;
import kr.rldk2002.bookstore.security.jwt.JwtAuthenticationService;
import kr.rldk2002.bookstore.security.jwt.JwtToken;
import kr.rldk2002.bookstore.security.userdetails.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private static final int REFRESH_TOKEN_EXPIRE_TIME = 60 * 60 * 24 * 7;  // 7일
    private final JwtAuthenticationService authenticationService;

    /*
     * JWT 로그인
     */
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

    /*
     * 로그아웃
     */
    @PostMapping("/logout")
    public boolean logout(
            HttpServletResponse response,
            Authentication authentication
    ) {
        if (authentication != null && authentication.isAuthenticated()) {
            SecurityContextHolder.clearContext();
            Cookie refreshTokenCooike = new Cookie("Authorization", "");
            refreshTokenCooike.setMaxAge(0);
            refreshTokenCooike.setPath("/");
            response.addCookie(refreshTokenCooike);
            log.debug("[ JWT 로그아웃 성공 ] id: {}", authentication.getName());
            return true;
        }
        return false;
    }

    @GetMapping("/authenticated")
    public User authentication(Authentication authentication) {
        if (authentication == null) return null;

        User user = (User) authentication.getPrincipal();
        if (user == null) return null;

        return user;
    }

}
