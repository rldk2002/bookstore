package kr.rldk2002.bookstore.book;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.JsonProcessingException;
import kr.rldk2002.bookstore.book.entity.InterparkBookResult;
import kr.rldk2002.bookstore.book.service.InterparkBookService;
import kr.rldk2002.bookstore.book.validation.BookGroupMarker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/books")
public class InterparkBookAPIController {
    private final InterparkBookService interparkBookService;

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
        InterparkBookResult result = interparkBookService.search(
                query, queryType, searchTarget, page, maxResults, sort, categoryId
        );
        log.debug(
                "[ 인터파크 도서 API ] query: {}, searchTarget: {}, categoryId: {}, page: {}, sort: {}",
                query, searchTarget, categoryId, page, sort
        );
        return result;
    }

}
