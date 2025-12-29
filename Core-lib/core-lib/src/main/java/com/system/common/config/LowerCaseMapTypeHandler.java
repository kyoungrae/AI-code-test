package com.system.common.config;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class LowerCaseMapTypeHandler extends BaseTypeHandler<Map<String, Object>> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Map<String, Object> parameter, JdbcType jdbcType)
            throws SQLException {
    }

    @Override
    public Map<String, Object> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return processResultSet(rs);
    }

    @Override
    public Map<String, Object> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return processResultSet(rs);
    }

    @Override
    public Map<String, Object> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return processResultSet(cs.getResultSet());
    }

    private Map<String, Object> processResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new HashMap<>();
        int columnCount = rs.getMetaData().getColumnCount();

        for (int i = 1; i <= columnCount; i++) {
            String columnName = rs.getMetaData().getColumnName(i).toLowerCase();  // 키를 소문자로 변환
            Object value = rs.getObject(i);  // 값이 null일 수 있음
            map.put(columnName, value);
        }

        return map;
    }
}