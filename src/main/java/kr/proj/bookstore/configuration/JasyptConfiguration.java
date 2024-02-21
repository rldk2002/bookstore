package kr.proj.bookstore.configuration;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*
 * 텍스트 암호화
 */
@Configuration
@EnableEncryptableProperties
public class JasyptConfiguration {

    private static final String APP_ENCRYPTION_PASSWORD = "APP_ENCRYPTION_PASSWORD";

    @Bean("jasyptStringEncryptor")
    public StringEncryptor stringEncryptor() {
        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();

        config.setPassword(System.getenv(APP_ENCRYPTION_PASSWORD)); // 암호화 키 값

        encryptor.setConfig(config);
        return encryptor;
    }

}
