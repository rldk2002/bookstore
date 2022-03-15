package kr.rldk2002.bookstore.security.userdetails;

import kr.rldk2002.bookstore.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class BasicUserDetailsService implements UserDetailsService {
    private final MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final Map<String, Object> params = Map.of("id", username);
        return Optional.ofNullable(memberMapper.selectMember(params))
                .map(User::new)
                .orElseThrow(() -> new UsernameNotFoundException(username + " 회원을 데이터베이스에서 찾을 수 없습니다."));
    }
}
