package kr.proj.bookstore.book.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NaverBookDetailResult {

    // 검색 결과를 생성한 시간
    private String lastBuildDate;

    // 총 검색 결과 개수
    private int total;

    // 검색 시작 위치
    private int start;

    // 한 번에 표시할 검색 결과 개수
    private int display;

    // 검색 결과
    private NaverBook item;


    private String title;
    private String link;
    private String description;
}
