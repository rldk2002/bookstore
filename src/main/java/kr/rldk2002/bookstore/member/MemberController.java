package kr.rldk2002.bookstore.member;

import kr.rldk2002.bookstore.member.validation.MemberGroupMarker;
import kr.rldk2002.bookstore.security.userdetails.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Set;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {
    private final PasswordEncoder passwordEncoder;
    private final MemberService memberService;

    /*
     * 회원가입
     */
    @PostMapping
    public ResponseEntity signUp(
            @Validated(MemberGroupMarker.SignUp.class) @ModelAttribute("member") Member member,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        String no = RandomStringUtils.randomAlphanumeric(8);
        String encodedPassword = passwordEncoder.encode(member.getPassword());
        Set<SimpleGrantedAuthority> roles = Set.of(new SimpleGrantedAuthority(Role.ROLE_USER.name()));

        member.setNo(no);
        member.setPassword(encodedPassword);
        member.setRoles(roles);
        memberService.addMember(member);

        return ResponseEntity.ok().build();
    }

    /*
     * 회원 가입 여부 체크
     */
    @GetMapping(value = "/has", params = "id")
    public boolean checkExistsMember(@RequestParam("id") String id) {
        return Objects.nonNull(memberService.getMemberPublic("id", id));
    }
}
