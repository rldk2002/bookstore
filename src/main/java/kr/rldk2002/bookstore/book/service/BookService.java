package kr.rldk2002.bookstore.book.service;

import kr.rldk2002.bookstore.book.entity.BookCart;
import kr.rldk2002.bookstore.book.mapper.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {
    private final BookMapper bookMapper;

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void addBookToBookCart(String memberNo, int itemId, int count) {
        bookMapper.mergeBookCart(new BookCart(itemId, count, memberNo));
    }
}
