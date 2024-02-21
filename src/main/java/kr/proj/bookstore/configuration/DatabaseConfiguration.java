package kr.proj.bookstore.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import kr.proj.bookstore.ComponentScanMarker;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

/*
 * 데이터베이스 설정
 */
@Configuration
@EnableTransactionManagement
@MapperScan(annotationClass = Mapper.class, basePackageClasses = ComponentScanMarker.class)
public class DatabaseConfiguration {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    public HikariConfig hikariConfig() {
        return new HikariConfig();
    }

    @Bean
    public DataSource dataSource() {
        return new HikariDataSource(hikariConfig());
    }

    @Bean
    public PlatformTransactionManager transactionManager (
            DataSource dataSource
    ) {
        return new DataSourceTransactionManager(dataSource);
    }


    /*
     * MyBatis 설정
     */
    @Bean
    public SqlSessionFactoryBean sqlSessionFactory (
            DataSource dataSource,
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
}
