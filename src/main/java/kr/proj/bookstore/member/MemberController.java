package kr.proj.bookstore.member;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.proj.bookstore.member.service.MemberService;
import kr.proj.bookstore.security.jwt.JwtAuthenticationService;
import kr.proj.bookstore.security.jwt.JwtToken;
import kr.proj.bookstore.security.userdetails.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {
    private static final int REFRESH_TOKEN_EXPIRE_TIME = 60 * 60 * 24 * 7;  // 7일

    private final MemberService memberService;
    private final JwtAuthenticationService authenticationService;

    /**
     * 회원 로그인
     */
    @PostMapping("/login")
    public Map<String, String> JWTFormLogin (
        @RequestParam("id") String id,
        @RequestParam("password") String password,
        HttpServletRequest request,
        HttpServletResponse response
    ) throws JsonProcessingException {
        JwtToken token = authenticationService.login(id, password);

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String ip = request.getRemoteAddr();
        authenticationService.mergeRefreshToken(user.getNo(), ip, token.getRefreshToken());

        Cookie cookie = new Cookie("Authorization", token.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(REFRESH_TOKEN_EXPIRE_TIME);
        response.addCookie(cookie);

        return Map.of("Authorization", token.getAccessToken());
    }

    @PostMapping("/logout")
    public ResponseEntity logout(
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo,
        HttpServletResponse response
    ) {
        if (memberNo != null) {
            authenticationService.removeRefreshToken(memberNo);
            Cookie cookie = new Cookie("Authorization", null);
            cookie.setMaxAge(0);
            cookie.setSecure(true);
            cookie.setPath("/");
            response.addCookie(cookie);
            return ResponseEntity.ok().build();
        } else {
            log.error("로그아웃 실패");
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/authentication")
    public ResponseEntity authentication() {
        List<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().toList();
        GrantedAuthority authority = authorities.get(0);

        if (authority.getAuthority().equals("ROLE_ANONYMOUS")) {
            log.debug("회원 조회 실패");
            return ResponseEntity.ok(false);
        } else {
            log.debug("회원 조회 성공");
            return ResponseEntity.ok(true);
        }
    }
}
