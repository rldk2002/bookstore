package kr.rldk2002.bookstore.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import kr.rldk2002.bookstore.member.Member;
import kr.rldk2002.bookstore.security.userdetails.AccountStatus;
import kr.rldk2002.bookstore.security.userdetails.User;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtTokenProvider {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String ROLES_KEY = "Roles";
    private static final String STATUSES_KEY = "Statuses";
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 30;            // 30분
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;  // 7일

    @Value("${jwt.secret}")
    private String secretKey;
    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Access Token 발행
     */
    public String generateAccessToken(@NonNull User user) {
        Date now = new Date();
        Date accessTokenExpiresIn = new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME);

        // 회원 등급
        String roles = user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        // 회원 권한
        String statuses = user.getStatuses().stream()
                .map(AccountStatus::name)
                .collect(Collectors.joining(","));

//        String statuese = Optional.ofNullable(user.getStatuses()).map()
        return Jwts.builder()
                .setSubject(user.getNo())               // 회원 번호
                .claim("id", user.getId())           // 회원 아이디
                .claim("name", user.getName())       // 회원 이름
                .claim(ROLES_KEY, roles)                // 회원 권한
                .claim(STATUSES_KEY, statuses)          // 회원 상태
                .setIssuedAt(now)                       // 토큰 발행일
                .setExpiration(accessTokenExpiresIn)    // 토큰 만료일
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Refresh Token 발행
     */
    public String generateRefreshToken(@NonNull String no) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(no)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Access, Refresh Token 발행
     */
    public JwtToken generateToken(@NonNull User user) {
        String accessToken = generateAccessToken(user);
        String refreshToken = generateRefreshToken(user.getNo());
        return new JwtToken(accessToken, refreshToken);
    }

    /**
     * Access Token에서 인증 정보 조회
     */
    public Authentication getAuthentication(@NonNull String accessToken) {
        // 토큰 복호화
        Claims claims = parseClaims(accessToken);

        String no = claims.getSubject();
        String id = claims.get("id", String.class);
        String name = claims.get("name", String.class);

        Set<SimpleGrantedAuthority> roles = Set.of();
        if (StringUtils.hasText(claims.get(ROLES_KEY, String.class))) {
            roles = Arrays.stream(claims.get(ROLES_KEY, String.class).split(","))
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toSet());
        }

        Set<AccountStatus> statuses = Set.of();
        if (StringUtils.hasText(claims.get(STATUSES_KEY, String.class))) {
            statuses = Arrays.stream(claims.get(STATUSES_KEY, String.class).split(","))
                    .map(AccountStatus::valueOf)
                    .collect(Collectors.toSet());
        }

        Member member = new Member();
        member.setId(id);
        member.setNo(no);
        member.setName(name);
        member.setRoles(roles);
        member.setStatuses(statuses);
        User principal = new User(member);
        return new UsernamePasswordAuthenticationToken(principal, "", roles);
    }

    /**
     * Request Header에서 토큰 정보를 꺼내오기
     * @return 토큰을 반환한다. 토큰이 없을 경우 null
     */
    public String resolveToken (
            HttpServletRequest request
    ) {
        String token = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(token) && token.startsWith(BEARER_PREFIX)) {
            return token.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    /**
     * Token parse
     */
    public Claims parseClaims (
            String token
    ) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    /**
     * 토큰이 유효한지 검사
     * (단, 만료된 토큰은 true로 처리됨)
     */
    public boolean validateToken (
            String token
    ) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            return true;
        } catch (SecurityException e) {
            log.debug("[ JWT ] JWT 서명(signature) 검증에 실패했습니다.");
        } catch (MalformedJwtException e) {
            log.debug("[ JWT ] JWT 토큰이 올바르게 구성되지 않았습니다.");
        } catch (UnsupportedJwtException | IllegalArgumentException e) {
            log.debug("[ JWT ] 지원되지 않는 형식의 JWT 토큰이거나 값이 null 입니다.");
        } catch (ClaimJwtException e) {
            log.debug("[ JWT ] JWT Claim 검사를 실패했습니다.");
        }
        return false;
    }

    /**
     * 토큰 만료 여부
     */
    public boolean isTokenExpired (
            String token
    ) {
        Claims claims = parseClaims(token);
        return claims.getExpiration().before(new Date());
    }
}
