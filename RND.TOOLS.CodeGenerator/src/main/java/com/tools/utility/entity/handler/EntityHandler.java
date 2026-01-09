package com.tools.utility.entity.handler;

import com.tools.utility.database.handler.DataBaseHandler;
import com.tools.utility.database.handler.DataBaseHandlerException;
import com.tools.utility.database.mapper.SqlMapClientWrapper;
import com.tools.utility.env.ConfigManager;

import java.util.List;

public class EntityHandler extends DataBaseHandler {
    /**
     * <pre>
     * SearchHandler constructor
     * </pre>
     */
    public EntityHandler(){}
    /**
     * <pre>
     * SearchHandler constructor
     * </pre>
     */
    public EntityHandler(SqlMapClientWrapper s){
        super(s);
    }
    /**
     * <pre>
     * SearchHandler constructor
     * </pre>
     */
    public EntityHandler(String u, String p, SqlMapClientWrapper s){
        super(u, p, s);
    }
    /**
     * <pre>
     * </pre>
     *
     * @throws DataBaseHandlerException
     * @return List<T>
     */
    public <T> List<T> select() throws DataBaseHandlerException {
        return super.select("SELECT.ENTITY", ConfigManager.getProperty("giens.Framework.Automation.Gen.Product.Code"));
    }
}
