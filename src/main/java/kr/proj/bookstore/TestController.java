package kr.proj.bookstore;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TestController {



    @GetMapping("/test1")
    public String test1() {

        SimpleStringPBEConfig config = new SimpleStringPBEConfig();
        StandardPBEStringEncryptor pbeEnc = new StandardPBEStringEncryptor();

        config.setPassword("CANNA"); // 암호화 키 값
//        config.setAlgorithm("PBEWITHHMACSHA512ANDAES_256");

        pbeEnc.setConfig(config);

        String key = pbeEnc.encrypt("jdbc:mysql://localhost:3306/bookstore");

        log.debug(key);



        return "test1";
    }
}
