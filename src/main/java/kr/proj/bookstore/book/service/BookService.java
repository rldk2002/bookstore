package kr.proj.bookstore.book.service;

import kr.proj.bookstore.book.mapper.BookMapper;
import kr.proj.bookstore.book.vo.BookCartItem;
import kr.proj.bookstore.book.vo.BookDibs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookService {
    private final BookMapper bookMapper;

    /* 도서 찜하기 */
    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public boolean toggleBookDibs(String isbn, String memberNo) {
        boolean isLiked = bookMapper.selectBookDibs(isbn, memberNo) != null;

        if (!isLiked) {
            BookDibs bookDibs = new BookDibs();
            bookDibs.setIsbn(isbn);
            bookDibs.setMemberNo(memberNo);
            bookDibs.setAddedDate(LocalDateTime.now());

            bookMapper.insertBookDibs(bookDibs);
            return true;
        } else {
            bookMapper.deleteBookDibs(isbn, memberNo);
            return false;
        }
    }

    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public void removeBookDibs(String isbn, String memberNo) {
        bookMapper.deleteBookDibs(isbn, memberNo);
    }

    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public BookDibs getBookDibs(String isbn, String memberNo) {
        BookDibs bookDibs = bookMapper.selectBookDibs(isbn, memberNo);
        return bookDibs;
    }

    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public List<BookDibs> getBookDibsList(String memberNo) {
        List<BookDibs> bookLikes = bookMapper.selectBookDibsList(memberNo);
        return bookLikes;
    }
    // 도서 찜하기

    /* 북카트 */
    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public BookCartItem getBookCartItem(String isbn, String memberNo) {
        BookCartItem bookCartItem = bookMapper.selectBookCartItem(isbn, memberNo);
        return bookCartItem;
    }

    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public List<BookCartItem> getBookCart(String memberNo) {
        List<BookCartItem> bookCart = bookMapper.selectBookCart(memberNo);
        return bookCart;
    }

    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public void addBookCartItem(String isbn, int count, String memberNo) {
        BookCartItem bookCartItem = new BookCartItem();
        bookCartItem.setIsbn(isbn);
        bookCartItem.setCount(count);
        bookCartItem.setMemberNo(memberNo);
        bookCartItem.setAddedDate(LocalDateTime.now());
        bookMapper.insertBookCartItem(bookCartItem);
    }

    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public void changeBookCartItemCount(String isbn, int count, String memberNo) {
        bookMapper.updateBookCartItemCount(isbn, count, memberNo);
    }

    @PreAuthorize("isAuthenticated() and ((#memberNo == principal.no) or hasRole('ROLE_ADMIN'))")
    public void removeBookCartItem(String isbn, String memberNo) {
        bookMapper.deleteBookCartItem(isbn, memberNo);
    }

    // 북카트
}
