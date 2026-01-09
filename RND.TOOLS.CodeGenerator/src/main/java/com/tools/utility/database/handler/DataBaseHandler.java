package com.tools.utility.database.handler;

import com.tools.utility.database.mapper.SqlMapClientWrapper;
import com.tools.utility.database.mapper.SqlMapConfig;

import java.sql.SQLException;
import java.util.List;

public abstract class DataBaseHandler {
    private SqlMapClientWrapper client = null;
    private String user_id = null;
    private String password = null;

    public DataBaseHandler(){
        this.client = SqlMapConfig.getSqlMapInstance();
    }
    public DataBaseHandler(SqlMapClientWrapper s){
        this.client = s;
    }
    public DataBaseHandler(String user_id, String password, com.tools.utility.database.mapper.SqlMapClientWrapper s){
        this.user_id = user_id;
        this.password = password;
        this.client = s;
    }
    protected void startTransaction() throws DataBaseHandlerException {
        try {
            this.client.startTransaction();
        } catch (SQLException var3) {
            DataBaseHandlerException de = new DataBaseHandlerException("trasaction start error");
            de.setCode(var3.getErrorCode());
            throw de;
        } catch (Exception var4) {
            throw new DataBaseHandlerException(var4);
        }
    }

    protected void commitTransaction() throws DataBaseHandlerException {
        try {
            this.client.commitTransaction();
        } catch (SQLException var3) {
            DataBaseHandlerException de = new DataBaseHandlerException("trasaction commit error");
            de.setCode(var3.getErrorCode());
            throw de;
        } catch (Exception var4) {
            throw new DataBaseHandlerException(var4);
        }
    }

    protected void endTransaction() throws DataBaseHandlerException {
        try {
            this.client.endTransaction();
        } catch (SQLException var3) {
            DataBaseHandlerException de = new DataBaseHandlerException("trasaction end error");
            de.setCode(var3.getErrorCode());
            throw de;
        } catch (Exception var4) {
            throw new DataBaseHandlerException(var4);
        }
    }

    protected int insert(String namespace, Object pram) throws DataBaseHandlerException {
        if (pram == null) {
            throw new DataBaseHandlerException(-1020);
        } else {
            int result = 1;

            try {
                this.client.insert(namespace, pram);
                result = 1;
                return result;
            } catch (SQLException var5) {
                throw new DataBaseHandlerException(var5);
            } catch (Exception var6) {
                throw new DataBaseHandlerException(var6);
            }
        }
    }

    protected int update(String namespace, Object pram) throws DataBaseHandlerException {
        if (pram == null) {
            throw new DataBaseHandlerException(-1020);
        } else {
            int result = 1;

            try {
                result = this.client.update(namespace, pram);
                return result;
            } catch (SQLException var5) {
                var5.printStackTrace();
                throw new DataBaseHandlerException(var5);
            } catch (Exception var6) {
                var6.printStackTrace();
                throw new DataBaseHandlerException(var6);
            }
        }
    }

    protected int delete(String namespace, Object pram) throws DataBaseHandlerException {
        if (pram == null) {
            throw new DataBaseHandlerException(-1020);
        } else {
            int result = 1;

            try {
                result = this.client.delete(namespace, pram);
                return result;
            } catch (SQLException var5) {
                throw new DataBaseHandlerException(var5);
            } catch (Exception var6) {
                throw new DataBaseHandlerException(var6);
            }
        }
    }

    public List select(String namespace, Object param) throws DataBaseHandlerException {
        try {
            return this.client.queryForList(namespace, param);
        } catch (SQLException var4) {
            throw new DataBaseHandlerException(var4);
        } catch (Exception var5) {
            throw new DataBaseHandlerException(var5);
        }
    }

    protected Object selectSingle(String namespace, Object pram) throws DataBaseHandlerException {
        Object result = null;

        try {
            result = this.client.queryForObject(namespace, pram);
            return result;
        } catch (SQLException var5) {
            throw new DataBaseHandlerException(var5);
        } catch (Exception var6) {
            throw new DataBaseHandlerException(var6);
        }
    }
}
