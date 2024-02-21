package kr.proj.bookstore.security.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.proj.bookstore.support.ResponseResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        PrintWriter out = response.getWriter();
        ResponseResult result = null;

        if (exception instanceof InsufficientAuthenticationException) {
            log.debug("[ 권한 불충분 ] 로그인을 하지 않음.");

            response.setStatus(HttpServletResponse.SC_OK);
            result = ResponseResult.response("Unauthorized", null, "권한이 없습니다.");
            out.print(result.toJson());
        }
        else {
            log.debug("[ 로그인 실패 ] {}", exception.getMessage());

            if (exception instanceof BadCredentialsException) {
                log.debug("잘못된 계정정보. (아이디, 비밀번호 불일치)");
                result = ResponseResult.response("Login_Failure", "Bad Credentials", "계정정보가 일치하지 않음.");
            }
            else if (exception instanceof AccountExpiredException) {
                log.debug("계정이 만료됨");
                result = ResponseResult.response("Login_Failure", "Account Expired", "계정이 만료됨.");
            }
            else if (exception instanceof LockedException) {
                log.debug("계정이 잠겨있음");
                result = ResponseResult.response("Login_Failure", "Account Locked", "계정이 잠겨있음.");
            }
            else if (exception instanceof DisabledException) {
                log.debug("계정 사용 불가");
                result = ResponseResult.response("Login_Failure", "Account Disabled", "사용할 수 없는 계정.");
            }
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print(result.toJson());

        }


    }
}
