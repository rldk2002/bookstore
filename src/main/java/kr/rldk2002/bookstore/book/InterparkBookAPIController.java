package kr.rldk2002.bookstore.book;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.JsonProcessingException;
import kr.rldk2002.bookstore.book.entity.InterparkBookResult;
import kr.rldk2002.bookstore.book.service.InterparkBookService;
import kr.rldk2002.bookstore.book.validation.BookGroupMarker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/books")
public class InterparkBookAPIController {
    private final InterparkBookService interparkBookService;

    /*
     * 인터파크 책 검색
     * http://book.interpark.com/bookPark/html/bookpinion/api_booksearch.html
     */
    @JsonView(BookGroupMarker.View.class)
    @GetMapping("/search")
    public InterparkBookResult bookListByQuery(
            @RequestParam(name = "query") String query,
            @RequestParam(name = "queryType", defaultValue = "title") String queryType,
            @RequestParam(name = "searchTarget", defaultValue = "book") String searchTarget,
            @RequestParam(name = "page", defaultValue = "1") String page,
            @RequestParam(name = "maxResults", defaultValue = "10") String maxResults,
            @RequestParam(name = "sort", defaultValue = "accuracy") String sort,
            @RequestParam(name = "categoryId", defaultValue = "100") String categoryId
    ) throws JsonProcessingException {
        InterparkBookResult result = interparkBookService.searchQuery(
                query, queryType, searchTarget, page, maxResults, sort, categoryId
        );
        log.debug(
                "[ 인터파크 도서 API ] query: {}, searchTarget: {}, categoryId: {}, page: {}, sort: {}",
                query, searchTarget, categoryId, page, sort
        );
        return result;
    }

    /*
     * 인터파크 베스트셀러, 추천도서, 신간도서 검색
     * http://book.interpark.com/bookPark/html/bookpinion/api_bestseller.html
     * http://book.interpark.com/bookPark/html/bookpinion/api_recommend.html
     * http://book.interpark.com/bookPark/html/bookpinion/api_newbook.html
     */
    @JsonView(BookGroupMarker.View.class)
    @GetMapping("/category/{categoryId}")
    public InterparkBookResult bookListByCategoryId(
            @PathVariable("categoryId") String categoryId,
            @RequestParam("section") String section
    ) throws JsonProcessingException {
        InterparkBookResult result = interparkBookService.searchSection(
                categoryId, section
        );
        log.debug(
                "[ 인터파크 도서 API ] categoryId: {}, section: {}",
                categoryId, section
        );
        return result;
    }

    /*
     * 인터파크 상품번호로 책 검색
     * http://book.interpark.com/bookPark/html/bookpinion/api_booksearch.html
     */
    @JsonView(BookGroupMarker.View.class)
    @GetMapping("/item/{itemId}")
    public InterparkBookResult bookOneByItemId(@PathVariable("itemId") String itemId) throws JsonProcessingException {
        InterparkBookResult result = interparkBookService.searchItem(itemId);
        log.debug("[ 인터파크 도서 API ] itemId: {}", itemId);
        return result;
    }

}
