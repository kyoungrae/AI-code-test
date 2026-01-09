package com.tools.utility.env;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
public class Configuration {
    public static final String DEFAULT_PROPERTIES = getDefaultProperties();
    private String propertyFile;
    private Properties properties;
    private static final String DEFAULT_FILE_NAME = "dccConfiguration.properties";

    private static String getDefaultProperties() {
        String rtn = null;
        String configfile = System.getProperty("dlwf.config.file");
        if (configfile != null && !"".equals(configfile)) {
            rtn = configfile;
        } else {
            rtn = "configSrc/dccConfiguration.properties";
        }

        return rtn;
    }

    public Configuration() {
        this.propertyFile = DEFAULT_PROPERTIES;
        this.properties = new Properties();
        this.loadConfiguration();
    }

    public Configuration(String propertyFile) {
        this.propertyFile = DEFAULT_PROPERTIES;
        this.properties = new Properties();
        this.propertyFile = propertyFile;
        this.loadConfiguration();
    }

    private void loadConfiguration() {
        InputStream fis = null;

        try {
            if ((new File(this.propertyFile)).exists()) {
                fis = new FileInputStream(this.propertyFile);
                System.out.println("[Configuration : loadConfiguration()] File Stream Loaded.");
            } else {
                fis = this.getClass().getClassLoader().getResourceAsStream(this.propertyFile);
                System.out.println("[Configuration : loadConfiguration()] Resource Loaded.");
            }

            this.properties.load((InputStream)fis);
        } catch (Exception var12) {
            StringBuilder sb = new StringBuilder();
            sb.append("[Configuration : loadConfiguration()] ").append(this.propertyFile).append(" 파일을 읽을 수 없습니다.");
            System.out.println(sb.toString());
            var12.printStackTrace();
        } finally {
            try {
                if (fis != null) {
                    ((InputStream)fis).close();
                }
            } catch (IOException var11) {
                System.out.println("[Configuration : loadConfiguration()] InputStream close중 에러 발생.");
            }

        }

    }

    public String getProperty(String key) {
        return this.properties.getProperty(key);
    }
}
