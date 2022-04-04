package kr.rldk2002.bookstore.book.entity;

import com.fasterxml.jackson.annotation.JsonView;
import kr.rldk2002.bookstore.book.validation.BookGroupMarker.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterparkBook {
    @JsonView({ View.class })
    private int itemId;

    @JsonView({ View.class })
    private String title;

    @JsonView({ View.class })
    private String isbn;

    @JsonView({ View.class })
    private String author;

    @JsonView({ View.class })
    private String translator;

    @JsonView({ View.class })
    private String description;

    @JsonView({ View.class })
    private int priceStandard;

    @JsonView({ View.class })
    private int priceSales;

    @JsonView({ View.class })
    private double discountRate;

    @JsonView({ View.class })
    private String saleStatus;

    @JsonView({ View.class })
    private String coverLargeUrl;

    @JsonView({ View.class })
    private int categoryId;

    @JsonView({ View.class })
    private String categoryName;

    @JsonView({ View.class })
    private String publisher;

    @JsonView({ View.class })
    private String pubDate;

    @JsonView({ View.class })
    private int rank;
    
    private double customerReviewRank;
    private int mileage;
    private int mileageRate;
    private String coverSmallUrl;
    private String link;
    private String mobileLink;
    private String additionalLink;
    private int reviewCount;
}
