package kr.proj.bookstore.security.jwt;

import com.fasterxml.jackson.core.JsonProcessingException;
import kr.proj.bookstore.security.userdetails.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class JwtAuthenticationService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider tokenProvider;
    private final JwtMapper jwtMapper;

    /**
     * JWT 로그인 및 토큰 생성
     */
    @PreAuthorize("permitAll()")
    public JwtToken login(
        String id,
        String password
    ) throws JsonProcessingException {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(id, password);
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        User user = (User) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user.getNo());

        authentication(accessToken);

        return new JwtToken(accessToken, refreshToken);
    }

    /**
     * Access Token 으로 회원 인증하기
     */
    @PreAuthorize("permitAll()")
    public void authentication(String accessToken) throws JsonProcessingException {
        Authentication authentication = tokenProvider.getAuthentication(accessToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.debug("[ JWT ] 토큰 인증 성공, id: {}", authentication.getName());
    }

    /**
     * refresh token을 db에 저장
     */
    @PreAuthorize("permitAll()")
    public void mergeRefreshToken(String memberNo, String ip, String refreshToken) {
        jwtMapper.deleteRefreshToken(memberNo);
        jwtMapper.insertRefreshToken(memberNo, ip, refreshToken);
    }

    @PreAuthorize("permitAll()")
    public RefreshToken getRefreshToken(String memberNo) {
        return jwtMapper.selectRefreshToken(memberNo);
    }

    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public void removeRefreshToken(String memberNo) {
        jwtMapper.deleteRefreshToken(memberNo);
    }
}
