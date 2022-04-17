package kr.rldk2002.bookstore.book.mapper;

import kr.rldk2002.bookstore.book.entity.BookCart;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookMapper {
    void mergeBookCart(@Param("bookCart") BookCart bookCart);
    List<BookCart> selectBookCartList(@Param("memberNo") String memberNo);
    void updateBookCartCount(@Param("bookCart") BookCart bookCart);
}
