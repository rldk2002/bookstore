package kr.proj.bookstore.security;

import kr.proj.bookstore.security.jwt.JwtAccessDeniedHandler;
import kr.proj.bookstore.security.jwt.JwtAuthenticationEntryPoint;
import kr.proj.bookstore.security.userdetails.PostAccountStatusChecker;
import kr.proj.bookstore.security.userdetails.PreAccountStatusChecker;
import kr.proj.bookstore.security.userdetails.SimpleUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class WebSecurityConfiguration {
    private final SimpleUserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .formLogin(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .requiresChannel(channelRequestMatcherRegistry -> channelRequestMatcherRegistry.anyRequest().requiresSecure())
                .authenticationProvider(daoAuthenticationProvider())
                .exceptionHandling(configurer -> {
                    configurer.authenticationEntryPoint(jwtAuthenticationEntryPoint);
                    configurer.accessDeniedHandler(jwtAccessDeniedHandler);
                })
                .authorizeHttpRequests(authorize -> {
                    authorize.anyRequest().permitAll();
                })
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        provider.setPreAuthenticationChecks(new PreAccountStatusChecker());
        provider.setPostAuthenticationChecks(new PostAccountStatusChecker());
        return provider;
    }

}
