package kr.rldk2002.bookstore.security.jwt;

import kr.rldk2002.bookstore.member.Member;
import kr.rldk2002.bookstore.member.MemberMapper;
import kr.rldk2002.bookstore.security.userdetails.User;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class JwtAuthenticationService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider tokenProvider;
    private final MemberMapper memberMapper;

    /**
     * JWT 로그인
     */
    @PreAuthorize("permitAll()")
    public JwtToken login(
            @NonNull String id,
            @NonNull String password
    ) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(id, password);
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        User user = (User) authentication.getPrincipal();
        JwtToken token = tokenProvider.generateToken(user);
        return token;
    }

    /**
     * access token 재발급
     * @return 성공시 access token, 실패시 null
     */
    @PreAuthorize("permitAll()")
    public String reissue(String refreshToken) {
        if (tokenProvider.validateToken(refreshToken) && !tokenProvider.isTokenExpired(refreshToken)) {
            String no = tokenProvider.parseClaims(refreshToken).getSubject();
            Member member = memberMapper.selectMember(Map.of("no", no));
            String accessToken = tokenProvider.generateAccessToken(new User(member));
            log.debug("[ JWT ] Access Token 재발행");
            return accessToken;
        }
        return null;
    }
}
