package kr.proj.bookstore.member.service;

import kr.proj.bookstore.member.mapper.MemberMapper;
import kr.proj.bookstore.member.vo.Member;
import kr.proj.bookstore.security.userdetails.Role;
import kr.proj.bookstore.security.userdetails.Status;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * 일반회원 추가
     */
    @PreAuthorize("permitAll()")
    public void addNormalMember(Member member) {
        String no = RandomStringUtils.random(8, true, true);
        String encodedPassword = passwordEncoder.encode(member.getPassword());

        member.setNo(no);
        member.setPassword(encodedPassword);
        member.setCreatedDate(LocalDateTime.now());
        member.setRoles(Set.of(Role.USER));

        memberMapper.insertMember(member);
        member.getRoles().forEach(role -> memberMapper.insertMemberRole(member.getNo(), role));
        memberMapper.insertMemberStatus(member.getNo(), new Status());
    }

    /**
     * 회원 조회
     */
    @PreAuthorize("permitAll()")
    public boolean hasMemberById(String id) {
        return memberMapper.selectMember(Map.of("param", "id", "value", id)) != null;
    }

    /**
     * 회원 조회
     */
    @PreAuthorize("permitAll()")
    public boolean hasMemberByName(String name) {
        return memberMapper.selectMember(Map.of("param", "name", "value", name)) != null;
    }
}
