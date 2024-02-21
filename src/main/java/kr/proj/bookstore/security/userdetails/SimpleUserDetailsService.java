package kr.proj.bookstore.security.userdetails;

import kr.proj.bookstore.member.mapper.MemberMapper;
import kr.proj.bookstore.member.vo.Member;
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
public class SimpleUserDetailsService implements UserDetailsService {
    private final MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        Member member = memberMapper.selectMember(Map.of("param", "id", "value", id));
        return Optional.ofNullable(member)
                .map(User::new)
                .orElseThrow(() -> new UsernameNotFoundException(id + " 회원을 데이터베이스에서 찾을 수 없습니다."));
    }

}
