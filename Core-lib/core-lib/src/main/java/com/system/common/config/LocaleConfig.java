package com.system.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.Arrays;
import java.util.Locale;

@Configuration
public class LocaleConfig {

    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
        // 기본 서비스 지원 언어 설정
        localeResolver.setSupportedLocales(Arrays.asList(new Locale("ko"), new Locale("en"), new Locale("mn")));
        // 기본값 설정
        localeResolver.setDefaultLocale(new Locale("ko"));
        return localeResolver;
    }
}
