package kr.proj.bookstore.book.mapper;

import kr.proj.bookstore.book.vo.BookCartItem;
import kr.proj.bookstore.book.vo.BookDibs;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookMapper {
    void insertBookDibs(@Param("bookDibs") BookDibs bookDibs);
    BookDibs selectBookDibs(@Param("isbn") String isbn, @Param("memberNo") String memberNo);
    List<BookDibs> selectBookDibsList(@Param("memberNo") String memberNo);
    void deleteBookDibs(@Param("isbn") String isbn, @Param("memberNo") String memberNo);
    void insertBookCartItem(@Param("bookCartItem") BookCartItem bookCartItem);
    BookCartItem selectBookCartItem(@Param("isbn") String isbn, @Param("memberNo") String memberNo);
    List<BookCartItem> selectBookCart(@Param("memberNo") String memberNo);
    void updateBookCartItemCount(@Param("isbn") String isbn, @Param("count") int count, @Param("memberNo") String memberNo);
    void deleteBookCartItem(@Param("isbn") String isbn, @Param("memberNo") String memberNo);
}
