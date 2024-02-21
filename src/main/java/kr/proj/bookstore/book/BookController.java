package kr.proj.bookstore.book;

import com.fasterxml.jackson.core.JsonProcessingException;
import kr.proj.bookstore.book.exception.NaverBookAPILoadException;
import kr.proj.bookstore.book.service.BookService;
import kr.proj.bookstore.book.service.NaverBookService;
import kr.proj.bookstore.book.vo.BookCartItem;
import kr.proj.bookstore.book.vo.BookDibs;
import kr.proj.bookstore.book.vo.NaverBookDetailResult;
import kr.proj.bookstore.book.vo.NaverBookResult;
import kr.proj.bookstore.support.ResponseResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {
    public static final int BOOKDIBS_MAX_SIZE = 30;
    public static final int BOOKCART_MAX_SIZE = 30;
    public static final int BOOKCART_ITEM_MAX_SIZE = 99;

    private final BookService bookService;
    private final NaverBookService naverBookService;

    /**
     * 네이버 도서 책 검색
     * https://developers.naver.com/docs/serviceapi/search/book/book.md
     */
    @GetMapping(value = "/search", params = { "query" })
    public ResponseEntity searchBooks (
        @RequestParam(name = "query") String query,
        @RequestParam(name = "start", defaultValue = "1") Integer start,
        @RequestParam(name = "sort", defaultValue = "sim") String sort  // sim: 정확도 내림차순, date: 출간일순 내림차순
    ) {
        try {
            NaverBookResult result = naverBookService.searchNaverBook(query, start, sort);
            log.debug("[ 네이버 도서 API ] Query: {}", query);

            return ResponseEntity.ok(result);
        } catch (UnsupportedEncodingException exception) {
            throw new NaverBookAPILoadException("NB01", "네이버 도서 API 불러오기 실패");
        }
    }

    /**
     * 네이버 도서 책 검색
     */
    @GetMapping(value = "/search", params = { "isbn" })
    public ResponseEntity searchBook (
        @RequestParam("isbn") String isbn
    ) {
        try {
            NaverBookDetailResult result = naverBookService.searchNaverBookDetail(isbn);
            log.debug("[ 네이버 도서 API ] ISBN: {}", isbn);

            return ResponseEntity.ok(result);
        } catch (UnsupportedEncodingException | JsonProcessingException exception) {
            throw new NaverBookAPILoadException("NB01", "네이버 도서 API 불러오기 실패");
        }
    }

    /**
     * 도서 찜 정보 조회
     */
    @GetMapping("/dibs")
    public ResponseResult getBookDibs(
        @RequestParam("isbn") String isbn,
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        BookDibs bookDibs = bookService.getBookDibs(isbn, memberNo);

        return ResponseResult.response("Success", bookDibs);
    }

    /**
     * 도서 찜 리스트 조회
     */
    @GetMapping("/dibs/list")
    public ResponseEntity getBookDibsList(
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        List<BookDibs> bookDibsList = bookService.getBookDibsList(memberNo);
        return ResponseEntity.ok(bookDibsList);
    }

    /**
     * 도서 찜하기
     */
    @PostMapping("/dibs")
    public ResponseResult toggleBookDibs(
        @RequestParam("isbn") String isbn,
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        List<BookDibs> bookDibsList = bookService.getBookDibsList(memberNo);

        if (bookDibsList.size() < BOOKDIBS_MAX_SIZE) {
            boolean isLiked = bookService.toggleBookDibs(isbn, memberNo);
            return new ResponseResult("Success", Boolean.valueOf(isLiked));
        } else {
            return new ResponseResult("Full", Boolean.valueOf(false));
        }
    }

    /**
     * 도서 찜 삭제
     */
    @DeleteMapping("/dibs")
    public ResponseEntity removeBookDibs(
        @RequestParam("isbn") String isbn,
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        bookService.removeBookDibs(isbn, memberNo);
        return ResponseEntity.ok().build();
    }

    /**
     * 북카트 추가
     */
    @PostMapping("/cart")
    public ResponseEntity addBookCart(
        @RequestParam("isbn") String isbn,
        @RequestParam(name = "count", defaultValue = "1") Integer count,
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (count > 0 && count < BOOKCART_ITEM_MAX_SIZE) {
            BookCartItem bookCartItem = bookService.getBookCartItem(isbn, memberNo);

            if (bookCartItem == null) {
                // 북카트에 없는 도서일경우
                bookService.addBookCartItem(isbn, count, memberNo);
            } else {
                // 북카트에 이미 추가된 도서일경우
                int sum = bookCartItem.getCount() + count;
                if (sum > BOOKCART_ITEM_MAX_SIZE) sum = 99;

                bookService.changeBookCartItemCount(isbn, sum, memberNo);
            }

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/cart")
    public ResponseEntity modifyBookCartItemCount(
        @RequestParam("isbn") String isbn,
        @RequestParam("count") Integer count,
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (count > 0) {
            bookService.changeBookCartItemCount(isbn, count, memberNo);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/cart")
    public ResponseEntity getBookCart(
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        List<BookCartItem> bookCart = bookService.getBookCart(memberNo);
        return ResponseEntity.ok(bookCart);
    }

    @DeleteMapping("/cart")
    public ResponseEntity removeBookCartItem(
        @RequestParam("isbn") String isbn,
        @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        bookService.removeBookCartItem(isbn, memberNo);
        return ResponseEntity.ok().build();
    }
}
