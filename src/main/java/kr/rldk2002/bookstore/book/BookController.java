package kr.rldk2002.bookstore.book;

import com.fasterxml.jackson.core.JsonProcessingException;
import kr.rldk2002.bookstore.book.entity.BookCart;
import kr.rldk2002.bookstore.book.entity.BookLike;
import kr.rldk2002.bookstore.book.entity.InterparkBookResult;
import kr.rldk2002.bookstore.book.service.BookService;
import kr.rldk2002.bookstore.book.service.InterparkBookService;
import kr.rldk2002.bookstore.support.ResponseResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/books")
public class BookController {
    private final InterparkBookService interparkBookService;
    private final BookService bookService;

    /* 북카트에 책 추가 */
    @PostMapping("/cart")
    public ResponseResult bookCartListSave(
            @RequestParam("itemId") String itemId,
            @RequestParam("count") int count,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) throws JsonProcessingException {
        InterparkBookResult bookResult = interparkBookService.searchItem(itemId);

        if (bookResult.getTotalResults() == 1) {
            bookService.addBookToBookCart(memberNo, Integer.valueOf(itemId), count);
            return new ResponseResult("200", "북카트 추가", true);
        } else {
            return null;
        }
    }

    /* 북카트 조회 */
    @GetMapping("/cart")
    public List<BookCart> bookCartList(
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        return bookService.getBookCartList(memberNo);
    }

    @GetMapping("/cart/size")
    public int bookCartListCount(
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        return bookService.getBookCartListCount(memberNo);
    }

    /* 북카트에 담긴 책 수량 수정 */
    @PatchMapping("/cart/count")
    public ResponseResult bookCartCountUpdate(
            @RequestParam("itemId") String itemId,
            @RequestParam("count") int count,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        BookCart bookCart = bookService.getBookCart(memberNo, Integer.valueOf(itemId));
        if (Objects.nonNull(bookCart)) {
            bookService.updateBookCartCount(memberNo, Integer.valueOf(itemId), count);
            return new ResponseResult("200", "북카트 수량 수정", true);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
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
    public ResponseResult bookLikeSave(
            @RequestParam("itemId") String itemId,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) throws JsonProcessingException {
        InterparkBookResult bookResult = interparkBookService.searchItem(itemId);

        if (bookResult.getTotalResults() == 1) {
            bookService.toggleBookLike(memberNo, Integer.valueOf(itemId));
            return new ResponseResult("200", "책 좋아요 기능", true);
        } else {
            return null;
        }
    }

    /* 좋아요 눌렀는지 조회 */
    @GetMapping("/like")
    public ResponseResult bookLikeOne(
            @RequestParam("itemId") String itemId,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        try {
            BookLike bookLike = bookService.getBookLike(memberNo, Integer.valueOf(itemId));
            log.debug("[ 좋아요 조회 성공 ] itemId: {}, {}", itemId, Objects.nonNull(bookLike));
            return new ResponseResult("200","", bookLike);
        } catch (NumberFormatException exception) {
            log.debug("[ 좋아요 조회 실패 ] itemId: {}, {}", itemId, exception.getMessage());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
