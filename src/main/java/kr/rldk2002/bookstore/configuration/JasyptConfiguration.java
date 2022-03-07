package kr.rldk2002.bookstore.configuration;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.EnvironmentStringPBEConfig;
import org.jasypt.spring31.properties.EncryptablePropertyPlaceholderConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

/*
 * 프로퍼티 암복호화
 */
@Configuration
public class JasyptConfiguration {

    @Bean
    public static EnvironmentStringPBEConfig environmentVariablesConfiguration() {
        EnvironmentStringPBEConfig config = new EnvironmentStringPBEConfig();
        config.setAlgorithm("PBEWithMD5AndDES");
        config.setPasswordEnvName("APP_ENCRYPTION_PASSWORD");   // 암복호화 key 이름 (환경변수에서 불러오는 이름)
        return config;
    }

    @Bean
    public static StandardPBEStringEncryptor configurationEncryptor() {
        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setConfig(environmentVariablesConfiguration());
        return encryptor;
    }

    @Bean
    public static EncryptablePropertyPlaceholderConfigurer propertyConfigurer() {
        EncryptablePropertyPlaceholderConfigurer configurer = new EncryptablePropertyPlaceholderConfigurer(configurationEncryptor());
        configurer.setLocations(new ClassPathResource("/properties.xml"));
        return configurer;
    }
}
