package kr.rldk2002.bookstore.book;

import kr.rldk2002.bookstore.book.entity.BookCart;
import kr.rldk2002.bookstore.book.entity.BookLike;
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

    /* 북카트에 책 추가 */
    @PostMapping("/cart")
    public boolean bookCartListSave(
            @RequestParam("itemId") int itemId,
            @RequestParam("count") int count,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        bookService.addBookToBookCart(memberNo, itemId, count);
        return true;
    }

    /* 북카트 조회 */
    @GetMapping("/cart")
    public List<BookCart> bookCartList(
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        return bookService.getBookCartList(memberNo);
    }

    /* 북카트에 담긴 책 수량 수정 */
    @PatchMapping("/cart/count")
    public boolean bookCartCountUpdate(
            @RequestParam("itemId") int itemId,
            @RequestParam("count") int count,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        bookService.updateBookCartCount(memberNo, itemId, count);
        return true;
    }

    /* 북카트에 담긴 책 삭제 */
    @DeleteMapping("/cart")
    public boolean bookCartRemove(
            @RequestParam("itemIds") List<Integer> itemIds,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        bookService.removeBookCart(memberNo, itemIds);
        return true;
    }

    /* 좋아요 누르기 */
    @PostMapping("/like")
    public boolean bookLikeSave(
            @RequestParam("itemId") int itemId,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        bookService.toggleBookLike(memberNo, itemId);
        return true;
    }

    @GetMapping("/like")
    public BookLike bookLikeOne(
            @RequestParam("itemId") int itemId,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        return bookService.getBookLike(memberNo, itemId);
    }
}
