package kr.proj.bookstore.security.jwt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import kr.proj.bookstore.security.userdetails.Status;
import kr.proj.bookstore.security.userdetails.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtTokenProvider {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String ROLES_KEY = "Roles";
    private static final String STATUSES_KEY = "Status";
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 30;            // 1시간
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;  // 7일

    @Value("${jwt.secret-key}")
    private String secretKey;
    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Access Token 발행
     */
    public String generateAccessToken(User user) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        // 회원 등급
        String roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        // 회원 권한
        String status = objectMapper.writeValueAsString(user.getStatus());

        Date now = new Date();
        Date accessTokenExpiresIn = new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME);

        String accessToken = Jwts.builder()
                .setSubject(user.getNo())               // 회원 번호
                .claim("id", user.getId())           // 회원 아이디
                .claim("name", user.getName())       // 회원 이름
                .claim(ROLES_KEY, roles)                // 회원 권한
                .claim(STATUSES_KEY, status)          // 회원 상태
                .setIssuedAt(now)                       // 토큰 발행일
                .setExpiration(accessTokenExpiresIn)    // 토큰 만료일
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        return accessToken;
    }

    /**
     * Refresh Token 발행
     */
    public String generateRefreshToken(String identifier) {
        Date now = new Date();
        String refreshToken = Jwts.builder()
                .setSubject(identifier)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        return refreshToken;
    }

    public Authentication getAuthentication(String accessToken) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        // 토큰 복호화
        Claims claims = parseClaims(accessToken);

        String no = claims.getSubject();
        String id = (String) claims.get("id");
        String name = (String) claims.get("name");
        Set<SimpleGrantedAuthority> roles = Arrays.stream(claims.get(ROLES_KEY).toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
        Status status = objectMapper.readValue(claims.get(STATUSES_KEY).toString(), Status.class);

        User principal = new User(no, id, name, roles, status);
        return new UsernamePasswordAuthenticationToken(principal, "", roles);
    }

    /**
     * Request Header에서 토큰 정보를 꺼내오기
     * @return 토큰을 반환한다. 토큰이 없을 경우 null
     */
    public String resolveToken(HttpServletRequest request) {
        String token = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(token) && token.startsWith(BEARER_PREFIX)) {
            return token.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            // JWT 토큰의 유효기간 만료
            return true;
        } catch (UnsupportedJwtException e) {
            log.debug("[ JWT ] 지원되지 않는 형식의 JWT 토큰입니다.");
        } catch (MalformedJwtException e) {
            log.debug("[ JWT ] JWT 토큰이 올바르게 구성되지 않았습니다.");
        } catch (SignatureException e) {
            log.debug("[ JWT ] JWT 서명(signature) 검증에 실패했습니다. (데이터 변조)");
        } catch (IllegalArgumentException e) {
            log.debug("[ JWT ] JWT String argument cannot be null or empty.");
        }
        return false;
    }

    /**
     * 토큰 만료 여부
     */
    public boolean isTokenExpired(String token) {
        Claims claims = parseClaims(token);
        boolean isExpired = claims.getExpiration().before(new Date());
        if (isExpired) log.debug("[ JWT ] 토큰이 만료됨.");
        return isExpired;
    }

    /**
     * 토큰 parse
     */
    public Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

}
