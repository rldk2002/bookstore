package kr.rldk2002.bookstore.security.jwt;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationInterceptor implements HandlerInterceptor {
    private final JwtTokenProvider tokenProvider;
    private final JwtAuthenticationService authenticationService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String accessToken = tokenProvider.resolveToken(request);
        if (tokenProvider.validateToken(accessToken)) {
            if (tokenProvider.isTokenExpired(accessToken)) {
                log.debug("[ JWT ] 만료된 Access Token이므로 Access Token 재발행 시도...");

                Cookie refreshTokenCookie = WebUtils.getCookie(request,"Authorization");
                if (refreshTokenCookie != null) {
                    String refreshToken = refreshTokenCookie.getValue();
                    String newAccessToken = authenticationService.reissue(refreshToken);
                    if (newAccessToken != null) {
                        jwtSecurityLogin(newAccessToken);
                        response.setHeader("Authorization", newAccessToken);
                    }
                }
            } else {
                log.debug("[ JWT ] Access Token이 유효하므로 로그인 시도");
                jwtSecurityLogin(accessToken);
            }
        }
        return true;
    }

    private void jwtSecurityLogin(@NonNull String accessToken) {
        Authentication authentication = tokenProvider.getAuthentication(accessToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.debug("[ JWT ] 로그인(Token) 성공, id: {}", authentication.getName());
    }
}
