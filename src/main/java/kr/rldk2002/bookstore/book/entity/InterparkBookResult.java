package kr.rldk2002.bookstore.book.entity;

import com.fasterxml.jackson.annotation.JsonView;
import kr.rldk2002.bookstore.book.entity.InterparkBook;
import kr.rldk2002.bookstore.book.validation.BookGroupMarker.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InterparkBookResult {
    @JsonView({ View.class })
    private int totalResults;

    @JsonView({ View.class })
    private int startIndex;

    @JsonView({ View.class })
    private int itemsPerPage;

    @JsonView({ View.class })
    private int maxResults;

    @JsonView({ View.class })
    private String query;

    @JsonView({ View.class })
    private String queryType;

    @JsonView({ View.class })
    private String searchCategoryId;

    @JsonView({ View.class })
    private String searchCategoryName;

    @JsonView({ View.class })
    private List<InterparkBook> item;

    private String title;
    private String link;
    private String imageUrl;
    private String language;
    private String copyright;
    private String pubDate;
    private String returnCode;
    private String returnMessage;
}
