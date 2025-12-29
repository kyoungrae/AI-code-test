package com.system.common.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class ApplicationResource {
    public static Map<String,Object> get(String applicationFileName){
        Properties properties = loadProperties(applicationFileName);
        String filePath = properties.getProperty("com.vims.common.file.directory.path");
        String imgPath = properties.getProperty("com.vims.common.file.img.path");
        Map<String,Object> map = new HashMap<>();
        map.put("filePath",filePath);
        map.put("imgPath",imgPath);
        return map;
    }
    private static Properties loadProperties(String propertyFileName) {
        Properties properties = new Properties();
        try (InputStream input = ApplicationResource.class.getClassLoader().getResourceAsStream(propertyFileName)) {
            if (input == null) {
                System.err.println("Sorry, unable to find " + propertyFileName);
                return properties; // 빈 프로퍼티 반환
            }
            properties.load(input);
        } catch (IOException e) {
            System.err.println("IOException: " + e.getMessage());
        }
        return properties;
    }
}
