package kr.proj.bookstore;

import kr.proj.bookstore.support.FullBeanNameGenerator;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        application.beanNameGenerator(new FullBeanNameGenerator());
        return application.sources(BookstoreApplication.class);
    }

}
