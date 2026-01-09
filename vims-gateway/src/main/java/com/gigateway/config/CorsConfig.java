package com.gigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Gateway CORS 설정
 * - withCredentials: true를 사용하는 요청을 위한 CORS 설정
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // 모든 Origin 허용 (운영 환경에서는 특정 도메인으로 제한 필요)
        corsConfig.addAllowedOriginPattern("*");

        // 모든 HTTP 메서드 허용
        corsConfig.addAllowedMethod("*");

        // 모든 헤더 허용
        corsConfig.addAllowedHeader("*");

        // 자격증명(쿠키 등) 허용
        corsConfig.setAllowCredentials(true);

        // Preflight 요청 캐시 시간 (초)
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
