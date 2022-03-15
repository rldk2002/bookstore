package kr.rldk2002.bookstore.security.jwt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.rldk2002.bookstore.support.ResponseResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.CharEncoding;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        response.setCharacterEncoding(CharEncoding.UTF_8);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        PrintWriter out = response.getWriter();
        ResponseResult error;

        if (exception instanceof InsufficientAuthenticationException) {

        } else {
            log.debug("[ 로그인 실패 ] {}", exception.getMessage());

            response.setStatus(HttpServletResponse.SC_OK);

            if (exception instanceof BadCredentialsException) {
                error = new ResponseResult("401-01", "Bad Credentials", "아이디와 비밀번호가 일치하지 않습니다.");
            }
            else if (exception instanceof LockedException) {
                error = new ResponseResult("401-02", "Lock", "계정이 잠겨 있습니다.");
            }
            else if (exception instanceof AccountExpiredException) {
                error = new ResponseResult("401-03", "Account Expired", "만료된 계정입니다.");
            }
            else if (exception instanceof CredentialsExpiredException) {
                error = new ResponseResult("401-04", "Credentials Expired", "비밀번호 유효기간 만료.");
            }
            else {
                error = new ResponseResult("401-99", "Unknown", "원인불명. 빨리 해결 요망!");
            }

            String errorJson = convertErrorToJson(error);
            out.print(errorJson);
        }
    }

    protected String convertErrorToJson (ResponseResult error) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(error);
    }
}
