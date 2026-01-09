package com.tools.utility.database.handler;

import java.io.PrintStream;
import java.io.PrintWriter;

public class ErrorCodeAccessibleException extends Exception{
    protected String errDesc = "";
    protected int errCode = 0;
    protected String[] msgData = new String[0];
    private static final long serialVersionUID = 1L;

    public void setCode(int errCode) {
        this.errCode = errCode;
    }

    public int getCode() {
        return this.errCode;
    }

    public String[] getMsgData() {
        return this.msgData;
    }

    public void setMsgData(String[] msgData) {
        this.msgData = msgData;
    }

    public ErrorCodeAccessibleException() {
    }

    public ErrorCodeAccessibleException(String errDesc) {
        super(errDesc);
        if (errDesc == null) {
            this.errDesc = this.getClass().getName();
        } else {
            this.errDesc = errDesc;
        }

    }

    public ErrorCodeAccessibleException(Exception e) {
        super(e);
    }

    public ErrorCodeAccessibleException(int errCode, String[] msgData) {
        this.errCode = errCode;
        this.msgData = msgData;
    }

    public ErrorCodeAccessibleException(int errCode) {
        this.errCode = errCode;
    }

    public synchronized Throwable fillInStackTrace() {
        return super.fillInStackTrace();
    }

    public Throwable getCause() {
        return super.getCause();
    }

    public String getLocalizedMessage() {
        return super.getLocalizedMessage();
    }

    public String getMessage() {
        if ("".equals(this.errDesc)) {
            this.errDesc = super.getMessage();
        }

        return this.errDesc;
    }

    public StackTraceElement[] getStackTrace() {
        return super.getStackTrace();
    }

    public synchronized Throwable initCause(Throwable cause) {
        return super.initCause(cause);
    }

    public void printStackTrace() {
        super.printStackTrace();
    }

    public void printStackTrace(PrintStream s) {
        super.printStackTrace(s);
    }

    public void printStackTrace(PrintWriter s) {
        super.printStackTrace(s);
    }

    public void setStackTrace(StackTraceElement[] stackTrace) {
        super.setStackTrace(stackTrace);
    }

    public String toString() {
        return super.toString();
    }

    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public boolean equals(Object obj) {
        return super.equals(obj);
    }

    protected void finalize() throws Throwable {
        super.finalize();
    }

    public int hashCode() {
        return super.hashCode();
    }
}
