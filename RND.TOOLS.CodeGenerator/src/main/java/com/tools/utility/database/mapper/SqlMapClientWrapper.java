package com.tools.utility.database.mapper;

import com.ibatis.common.util.PaginatedList;
import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapSession;
import com.ibatis.sqlmap.client.event.RowHandler;
import com.ibatis.sqlmap.engine.execution.BatchException;
import com.ibatis.sqlmap.engine.impl.ExtendedSqlMapClient;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class SqlMapClientWrapper {
    private SqlMapClient client = null;

    public SqlMapClientWrapper(SqlMapClient client) {
        this.client = (ExtendedSqlMapClient)client;
    }

    public SqlMapClientWrapper(ExtendedSqlMapClient client) {
        this.client = client;
    }

    public void commitTransaction() throws SQLException {
        this.client.commitTransaction();
    }

    public int delete(String id, Object param) throws SQLException {
        return this.client.delete(id, param);
    }

    public int delete(String id) throws SQLException {
        return this.client.delete(id);
    }

    public void endTransaction() throws SQLException {
        this.client.endTransaction();
    }

    public int executeBatch() throws SQLException {
        return this.client.executeBatch();
    }

    public List executeBatchDetailed() throws SQLException, BatchException {
        return this.client.executeBatchDetailed();
    }

    public void flushDataCache() {
        this.client.flushDataCache();
    }

    public void flushDataCache(String cacheId) {
        this.client.flushDataCache(cacheId);
    }

    public Connection getCurrentConnection() throws SQLException {
        return this.client.getCurrentConnection();
    }

    public DataSource getDataSource() {
        return this.client.getDataSource();
    }

    public SqlMapSession getSession() {
        return this.client.getSession();
    }

    public Connection getUserConnection() throws SQLException {
        return this.client.getUserConnection();
    }

    public Object insert(String id, Object param) throws SQLException {
        return this.client.insert(id, param);
    }

    public Object insert(String id) throws SQLException {
        return this.client.insert(id);
    }

    public SqlMapSession openSession() {
        return this.client.openSession();
    }

    public SqlMapSession openSession(Connection conn) {
        return this.client.openSession(conn);
    }

    public List queryForList(String id, int skip, int max) throws SQLException {
        return this.client.queryForList(id, skip, max);
    }

    public List queryForList(String id, Object paramObject, int skip, int max) throws SQLException {
        return this.client.queryForList(id, paramObject, skip, max);
    }

    public List queryForList(String id, Object paramObject) throws SQLException {
        return this.client.queryForList(id, paramObject);
    }

    public List queryForList(String id) throws SQLException {
        return this.client.queryForList(id);
    }

    public Map queryForMap(String id, Object paramObject, String keyProp, String valueProp) throws SQLException {
        return this.client.queryForMap(id, paramObject, keyProp, valueProp);
    }

    public Map queryForMap(String id, Object paramObject, String keyProp) throws SQLException {
        return this.client.queryForMap(id, paramObject, keyProp);
    }

    public Object queryForObject(String id, Object paramObject, Object resultObject) throws SQLException {
        return this.client.queryForObject(id, paramObject, resultObject);
    }

    public Object queryForObject(String id, Object paramObject) throws SQLException {
        return this.client.queryForObject(id, paramObject);
    }

    public Object queryForObject(String id) throws SQLException {
        return this.client.queryForObject(id);
    }

    public PaginatedList queryForPaginatedList(String id, int pageSize) throws SQLException {
        return this.client.queryForPaginatedList(id, pageSize);
    }

    public PaginatedList queryForPaginatedList(String id, Object paramObject, int pageSize) throws SQLException {
        return this.client.queryForPaginatedList(id, paramObject, pageSize);
    }

    public void queryWithRowHandler(String id, Object paramObject, RowHandler rowHandler) throws SQLException {
        this.client.queryWithRowHandler(id, paramObject, rowHandler);
    }

    public void queryWithRowHandler(String id, RowHandler rowHandler) throws SQLException {
        this.client.queryWithRowHandler(id, rowHandler);
    }

    public void setUserConnection(Connection connection) throws SQLException {
        this.client.setUserConnection(connection);
    }

    public void startBatch() throws SQLException {
        this.client.startBatch();
    }

    public void startTransaction() throws SQLException {
        this.client.startTransaction();
    }

    public void startTransaction(int transactionIsolation) throws SQLException {
        this.client.startTransaction(transactionIsolation);
    }

    public int update(String id, Object param) throws SQLException {
        return this.client.update(id, param);
    }

    public int update(String id) throws SQLException {
        return this.client.update(id);
    }
}
