package edu.jensen.webshopapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ ALLOW FRONTEND ORIGINS
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",
            "http://192.168.*.*:3000",
            "http://10.*.*.*:3000"
        ));

        // ✅ REQUIRED FOR COOKIES / SESSION
        config.setAllowCredentials(true);

        // ✅ ALLOW EVERYTHING ELSE
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
