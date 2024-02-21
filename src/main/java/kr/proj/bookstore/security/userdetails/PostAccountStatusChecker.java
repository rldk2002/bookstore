package kr.proj.bookstore.security.userdetails;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PostAccountStatusChecker implements UserDetailsChecker {
    protected final MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();

    @Override
    public void check(UserDetails toCheck) {
        User user = (User) toCheck;
        Status status = user.getStatus();

        if (status.isEnabled() == false) {
            throw new DisabledException(messages.getMessage("AccountStatusUserDetailsChecker.disabled", "계정이 비활성화되어 있습니다"));
        }
        else {
            if (status.isCredentialsExpired()) {
                throw new CredentialsExpiredException(messages.getMessage("AccountStatusUserDetailsChecker.credentialsExpired", "비밀번호가 만료되었습니다."));
            }
            if (status.isAccountExpired()) {
                throw new AccountExpiredException(messages.getMessage("AccountStatusUserDetailsChecker.expired", "계정이 만료되었습니다"));
            }
            if (status.isAccountLocked()) {
                throw new LockedException(messages.getMessage("AccountStatusUserDetailsChecker.locked", "계정이 잠겨있습니다"));
            }
        }
    }
}
