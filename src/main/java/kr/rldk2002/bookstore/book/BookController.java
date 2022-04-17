package kr.rldk2002.bookstore.book;

import kr.rldk2002.bookstore.book.entity.BookCart;
import kr.rldk2002.bookstore.book.service.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/books")
public class BookController {
    private final BookService bookService;

    @PostMapping("/cart")
    public boolean bookCartListSave(
            @RequestParam("itemId") int itemId,
            @RequestParam("count") int count,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        bookService.addBookToBookCart(memberNo, itemId, count);
        return true;
    }

    @GetMapping("/cart")
    public List<BookCart> bookCartList(
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        return bookService.getBookCartList(memberNo);
    }

    @PatchMapping("/cart/count")
    public boolean bookCartCountUpdate(
            @RequestParam("itemId") int itemId,
            @RequestParam("count") int count,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        bookService.updateBookCartCount(memberNo, itemId, count);
        return true;
    }
}
