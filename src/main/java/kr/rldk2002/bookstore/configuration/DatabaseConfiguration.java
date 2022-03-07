package kr.rldk2002.bookstore.configuration;

import kr.rldk2002.bookstore.ComponentScanMarker;
import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@MapperScan(annotationClass = Mapper.class, basePackageClasses = ComponentScanMarker.class)
public class DatabaseConfiguration {

    @Bean
    public BasicDataSource dataSource (
            @Value("${database.driverClass}") String driver,
            @Value("${database.url}") String url,
            @Value("${database.username}") String username,
            @Value("${database.password}") String password
    ) {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName(driver);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    @Bean
    public SqlSessionFactoryBean sqlSessionFactory (
            BasicDataSource dataSource,
            ApplicationContext applicationContext
    ) {
        SqlSessionFactoryBean ssfb = new SqlSessionFactoryBean();
        ssfb.setDataSource(dataSource);
        ssfb.setConfigLocation(applicationContext.getResource("classpath:/mybatis/mybatis-config.xml"));
        return ssfb;
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate (
            SqlSessionFactory sqlSessionFactory
    ) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

    @Bean
    public PlatformTransactionManager transactionManager (
            BasicDataSource dataSource
    ) {
        return new DataSourceTransactionManager(dataSource);
    }

}
