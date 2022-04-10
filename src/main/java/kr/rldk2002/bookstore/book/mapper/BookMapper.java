package kr.rldk2002.bookstore.book.mapper;

import kr.rldk2002.bookstore.book.entity.BookCart;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BookMapper {
    void mergeBookCart(@Param("bookCart") BookCart bookCart);
}
