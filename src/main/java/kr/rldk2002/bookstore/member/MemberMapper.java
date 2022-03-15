package kr.rldk2002.bookstore.member;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface MemberMapper {
    Member selectMember(Map<String, Object> params);
}
