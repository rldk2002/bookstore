package kr.rldk2002.bookstore.member;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberMapper memberMapper;

    /**
     * 회원 추가
     */
    @PreAuthorize("permitAll()")
    public void addMember(Member member) {
        memberMapper.insertMember(member);
    }

    @PreAuthorize("permitAll()")
    public Member getMemberPublic(String name, String value) {
        Map<String, Object> params = Map.of(name, value);
        return memberMapper.selectMember(params);
    }
}
