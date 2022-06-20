package com.zuki.admin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
public class ApplicationConfig  extends WebSecurityConfigurerAdapter {
        @Override //TODO: Configure security as illustrated in https://gitlab.com/rafael.solano/photo-booth-service/-/blob/master/src/main/java/com/mqa/ApplicationConfig.java
        protected void configure(HttpSecurity security) throws Exception
        {
            security.csrf().disable().cors().and().httpBasic().disable();
        }


    
       @Bean
        CorsConfigurationSource corsConfigurationSource() {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
            
            return source;
        }   

}