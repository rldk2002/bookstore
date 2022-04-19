package kr.rldk2002.bookstore.book.service;

import kr.rldk2002.bookstore.book.entity.BookCart;
import kr.rldk2002.bookstore.book.entity.BookLike;
import kr.rldk2002.bookstore.book.mapper.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {
    private final BookMapper bookMapper;

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void addBookToBookCart(String memberNo, int itemId, int count) {
        bookMapper.mergeBookCart(new BookCart(memberNo, itemId, count));
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public List<BookCart> getBookCartList(String memberNo) {
        return bookMapper.selectBookCartList(memberNo);
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void updateBookCartCount(String memberNo, int itemId, int count) {
        bookMapper.updateBookCartCount(new BookCart(memberNo, itemId, count));
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void removeBookCart(String memberNo, List<Integer> itemIds) {
        itemIds.forEach(itemId -> bookMapper.deleteBookCart(memberNo, itemId));
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void toggleBookLike(String memberNo, int itemId) {
        bookMapper.mergeBookLike(memberNo, itemId);
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public BookLike getBookLike(String memberNo, int itemId) {
        return bookMapper.selectBookLike(memberNo, itemId);
    }
}
