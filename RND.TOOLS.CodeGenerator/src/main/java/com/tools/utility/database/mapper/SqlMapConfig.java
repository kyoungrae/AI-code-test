package com.tools.utility.database.mapper;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapClientBuilder;
import org.apache.ibatis.io.Resources;

import java.io.IOException;
import java.io.Reader;

public class SqlMapConfig {
    public static final String CONFIG = getDefaultConfig();
    private static SqlMapClient sqlMap = null;
    private static SqlMapClientWrapper sqlMapA = null;
    private static boolean initialized = false;

    public SqlMapConfig(){}
    private static String getDefaultConfig(){
        String rts = null;
        String configfile = System.getProperty("dlwf.ibatis.sqlmapconfig.file");
        if(configfile != null && !configfile.isEmpty()){
            rts = configfile;
        }else{
            rts = "configSrc/dccSqlMapConfig.xml";
        }
        return rts;
    }

    public static synchronized void init(){
        try{
            Reader reader = null;
            try{
                reader = Resources.getResourceAsReader(CONFIG);
            }catch(IOException b){
                throw new RuntimeException(b);
            }
            sqlMap = SqlMapClientBuilder.buildSqlMapClient(reader);
            sqlMapA = new SqlMapClientWrapper(sqlMap);
        } catch (Exception e) {
            throw new RuntimeException(e + "Could not find" + CONFIG);
        }
    }
    public static SqlMapClientWrapper getSqlMapInstance(){
        if(!initialized){
            init();
            initialized = true;
        }
        return sqlMapA;
    }
    public boolean isInitialized(){
        return initialized;
    }
}
