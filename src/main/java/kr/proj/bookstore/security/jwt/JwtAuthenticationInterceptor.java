package kr.proj.bookstore.security.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.proj.bookstore.member.mapper.MemberMapper;
import kr.proj.bookstore.member.vo.Member;
import kr.proj.bookstore.security.userdetails.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.WebUtils;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationInterceptor implements HandlerInterceptor {
    private final JwtTokenProvider tokenProvider;
    private final JwtAuthenticationService authenticationService;
    private final MemberMapper memberMapper;

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        log.debug("jwt 로그인 인터셉터 post");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.debug("jwt 로그인 인터셉터 pre");

        String accessTokenClient = tokenProvider.resolveToken(request);
        if (tokenProvider.validateToken(accessTokenClient)) {   // 1. AccessToken이 유효하고
            if (tokenProvider.isTokenExpired(accessTokenClient)) {  // 2-1. AceessToken이 만료되었다면
                log.debug("[ JWT ] Access Token이 만료되어 Access Token 재발행 시도...");

                Cookie refreshTokenCookie = WebUtils.getCookie(request,"Authorization");
                if (refreshTokenCookie != null) {   // 3. RefreshToken이 존재여부 확인
                    Claims accessTokenClaims = tokenProvider.parseClaims(accessTokenClient);
                    String memberNo = accessTokenClaims.getSubject();

                    RefreshToken refreshTokenVO = authenticationService.getRefreshToken(memberNo);
                    String refreshTokenClient = refreshTokenCookie.getValue();
                    String currentIp = request.getRemoteAddr();

                    if (refreshTokenVO.getRefreshToken().equals(refreshTokenClient) && refreshTokenVO.getIp().equals(currentIp)) {
                        Member member = memberMapper.selectMember(Map.of("param", "no", "value", memberNo));
                        User user = new User(member);
                        String newAccessToken = tokenProvider.generateAccessToken(user);
                        log.debug("[ JWT ] Access Token 재발행");

                        response.setHeader("Authorization", newAccessToken);
                        authenticationService.authentication(newAccessToken);
                    }
                }
            }
            else {  // 2-2. AceessToken이 만료되지 않았다면
                authenticationService.authentication(accessTokenClient);
            }
        }

        return true;
    }

}
