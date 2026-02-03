package com.giwebapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
@ComponentScan(basePackages = {
        "com.giwebapp",
        "com.system.common.util.message",
        "com.system.common.util.pageredirect"
})
public class VimsWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(VimsWebApplication.class, args);
    }

}
