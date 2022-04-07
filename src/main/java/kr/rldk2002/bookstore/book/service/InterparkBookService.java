package kr.rldk2002.bookstore.book.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.rldk2002.bookstore.book.entity.InterparkBook;
import kr.rldk2002.bookstore.book.entity.InterparkBookResult;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class InterparkBookService {
    @Value("${interpark.key}") private String key;

    /**
     * http://book.interpark.com/bookPark/html/bookpinion/api_booksearch.html
     */
    @PreAuthorize("permitAll()")
    public InterparkBookResult searchQuery(
            String query,
            String queryType,
            String searchTarget,
            String start,
            String maxResults,
            String sort,
            String categoryId
    ) throws JsonProcessingException {
        String response = WebClient.create("http://book.interpark.com/api").get()
                .uri("/search.api", uriBuilder -> uriBuilder
                        .queryParam("key", key)
                        .queryParam("output", "json")
                        .queryParam("query", query)
                        .queryParam("queryType", queryType)
                        .queryParam("searchTarget", searchTarget)
                        .queryParam("start", start)
                        .queryParam("maxResults", maxResults)
                        .queryParam("sort", sort)
                        .queryParam("categoryId", categoryId)
                        .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(response, InterparkBookResult.class);
    }

    /**
     * http://book.interpark.com/bookPark/html/bookpinion/api_bestseller.html
     * http://book.interpark.com/bookPark/html/bookpinion/api_recommend.html
     * http://book.interpark.com/bookPark/html/bookpinion/api_newbook.html
     * @param section bestSeller, recommend, newBook
     */
    @PreAuthorize("permitAll()")
    public InterparkBookResult searchSection(
            String categoryId,
            String section
    ) throws JsonProcessingException {
        String response = WebClient.create("http://book.interpark.com/api").get()
                .uri("/" + section + ".api", uriBuilder -> uriBuilder
                        .queryParam("key", key)
                        .queryParam("output", "json")
                        .queryParam("categoryId", categoryId)
                        .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(response, InterparkBookResult.class);
    }

    /**
     * http://book.interpark.com/bookPark/html/bookpinion/api_booksearch.html
     */
    @PreAuthorize("permitAll()")
    public InterparkBookResult searchItem(String itemId) throws JsonProcessingException {
        String response = WebClient.create("http://book.interpark.com/api").get()
                .uri("/search.api", uriBuilder -> uriBuilder
                        .queryParam("key", key)
                        .queryParam("output", "json")
                        .queryParam("queryType", "productNumber")
                        .queryParam("query", itemId)
                        .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        InterparkBookResult result = objectMapper.readValue(response, InterparkBookResult.class);
        return result;
    }
}
