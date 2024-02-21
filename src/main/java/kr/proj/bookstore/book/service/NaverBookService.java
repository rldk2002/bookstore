package kr.proj.bookstore.book.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import kr.proj.bookstore.book.vo.NaverBookDetailResult;
import kr.proj.bookstore.book.vo.NaverBookResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.UnsupportedEncodingException;

@Slf4j
@Service
@Transactional
public class NaverBookService {
    private final WebClient webClient;

    public NaverBookService(
        @Value("${naver.clinet.id}") String clientID,
        @Value("${naver.clinet.secret}") String clientSecret
    ) {
        this.webClient = WebClient.builder()
            .defaultHeaders(httpHeaders -> {
                httpHeaders.add("X-Naver-Client-Id", clientID);
                httpHeaders.add("X-Naver-Client-Secret", clientSecret);
            }).build();
    }

    @PreAuthorize("permitAll()")
    public NaverBookResult searchNaverBook(String query, int start, String sort) throws UnsupportedEncodingException {
        byte[] bytes = query.getBytes("UTF-8");
        String encodedQuery = new String(bytes);

        NaverBookResult books = webClient
            .mutate()
            .baseUrl("https://openapi.naver.com/v1/search/book.json")
            .build()
            .get()
            .uri(uriBuilder ->
                uriBuilder
                    .queryParam("query", encodedQuery)
                    .queryParam("display", 20)
                    .queryParam("start", start)
                    .queryParam("sort", sort)
                    .build()
            )
            .retrieve()
            .bodyToMono(NaverBookResult.class)
            .block();

        return books;
    }

    @PreAuthorize("permitAll()")
    public NaverBookDetailResult searchNaverBookDetail(String isbn) throws UnsupportedEncodingException, JsonProcessingException {
        byte[] bytes = isbn.getBytes("UTF-8");
        String encodedQuery = new String(bytes);

        String books = webClient
            .mutate()
            .baseUrl("https://openapi.naver.com/v1/search/book_adv.xml")
            .build()
            .get()
            .uri(uriBuilder ->
                uriBuilder
                    .queryParam("d_isbn", isbn)
                    .build()
            )
            .retrieve()
            .bodyToMono(String.class)
            .block();

        String xml = books.substring(books.indexOf("<channel>"), books.indexOf("</rss>"));
        XmlMapper xmlMapper = new XmlMapper();
        NaverBookDetailResult result = xmlMapper.readValue(xml, NaverBookDetailResult.class);

        return result;
    }

}
