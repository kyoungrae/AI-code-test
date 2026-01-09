package com.tools.utility.env;
/**
 * <pre>
 * ConfigManager
 * </pre>
 *
 * @since 2024. 5. 17
 * @version 1.0
 * @author 이경태
 *
 */
public class ConfigManager {
    private static ConfigManager instance = null;
    private final Configuration env = new Configuration();

    public ConfigManager() {
    }

    public static synchronized ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager();
        }

        return instance;
    }

    public static Configuration getConfiguration() {
        return getInstance().env;
    }

    public static String getProperty(String key) {
        String value = getConfiguration().getProperty(key);
        return value != null ? value.trim() : null;
    }
}
