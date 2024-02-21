package kr.proj.bookstore.security.userdetails;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.stereotype.Component;

@Component
public class PreAccountStatusChecker implements UserDetailsChecker {
    @Override
    public void check(UserDetails toCheck) {

    }
}
