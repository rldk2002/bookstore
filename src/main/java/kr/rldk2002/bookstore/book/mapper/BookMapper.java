package kr.rldk2002.bookstore.book.mapper;

import kr.rldk2002.bookstore.book.entity.BookCart;
import kr.rldk2002.bookstore.book.entity.BookLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookMapper {
    void mergeBookCart(@Param("bookCart") BookCart bookCart);
    List<BookCart> selectBookCartList(@Param("memberNo") String memberNo);
    BookCart selectBookCart(@Param("memberNo") String memberNo, @Param("itemId") int itemId);
    void updateBookCartCount(@Param("bookCart") BookCart bookCart);
    void deleteBookCart(@Param("memberNo") String memberNo, @Param("itemId") int itemId);
    void mergeBookLike(@Param("memberNo") String memberNo, @Param("itemId") int itemId);
    BookLike selectBookLike(@Param("memberNo") String memberNo, @Param("itemId") int itemId);
}
