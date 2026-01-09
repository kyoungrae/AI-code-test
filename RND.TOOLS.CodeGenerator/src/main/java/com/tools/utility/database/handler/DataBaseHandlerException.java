package com.tools.utility.database.handler;

import java.sql.SQLException;

public class DataBaseHandlerException extends ErrorCodeAccessibleException{
    public static final int UNKNOWN_ERROR = -1000;
    public static final int DATABASE_ERROR = -1010;
    public static final int PARAMTER_IS_NULL = -1020;
    protected int sqlErrCode = 0;

    public DataBaseHandlerException(String errDesc) {
        if (errDesc == null) {
            this.errDesc = this.getClass().getName();
        } else {
            this.errDesc = errDesc;
        }

    }

    public DataBaseHandlerException(Exception e) {
        String msg = e.getLocalizedMessage();
        if (msg == null || "".equals(msg)) {
            msg = e.getMessage();
        }

        if (msg == null || "".equals(msg)) {
            msg = e.getClass().getName();
        }

        this.errDesc = msg;
        this.errCode = -1000;
        e.printStackTrace();
    }

    public DataBaseHandlerException(SQLException se) {
        String msg = se.getLocalizedMessage();
        if (msg == null || "".equals(msg)) {
            msg = se.getMessage();
        }

        if (msg == null || "".equals(msg)) {
            msg = se.getClass().getName();
        }

        this.errDesc = msg;
        this.errCode = -1010;
        this.sqlErrCode = se.getErrorCode();
        se.printStackTrace();
    }

    public DataBaseHandlerException(int errcode) {
        super(errcode);
    }

    public DataBaseHandlerException(int errcode, String[] msgData) {
        this.setCode(errcode);
        this.setMsgData(msgData);
    }

    public int getSqlErrCode() {
        return this.sqlErrCode;
    }
}
