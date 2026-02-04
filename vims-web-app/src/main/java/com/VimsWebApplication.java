package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class }, scanBasePackages = {
        "com.giwebapp",
        "com.system.common.util.message",
        "com.system.common.util.pageredirect"
})
public class VimsWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(VimsWebApplication.class, args);
    }

}
