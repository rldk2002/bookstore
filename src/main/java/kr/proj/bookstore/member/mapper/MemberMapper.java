package kr.proj.bookstore.member.mapper;

import kr.proj.bookstore.member.vo.Member;
import kr.proj.bookstore.security.userdetails.Role;
import kr.proj.bookstore.security.userdetails.Status;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;
import java.util.Set;

@Mapper
public interface MemberMapper {
    void insertMember(@Param("member") Member member);
    Member selectMember(Map<String, String> params);
    void insertMemberRole(@Param("memberNo") String memberNo, @Param("role") Role role);
    Set<Role> selectMemberRoles(@Param("memberNo") String memberNo);
    void insertMemberStatus(@Param("memberNo") String memberNo, @Param("status") Status status);
    Status selectMemberStatus(@Param("memberNo") String memberNo);
}
