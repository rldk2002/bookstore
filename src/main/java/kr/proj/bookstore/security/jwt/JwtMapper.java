package kr.proj.bookstore.security.jwt;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface JwtMapper {
    void insertRefreshToken(@Param("memberNo") String memberNo, @Param("ip") String ip, @Param("refreshToken") String refreshToken);
    RefreshToken selectRefreshToken(@Param("memberNo") String memberNo);
    void deleteRefreshToken(@Param("memberNo") String memberNo);
}
