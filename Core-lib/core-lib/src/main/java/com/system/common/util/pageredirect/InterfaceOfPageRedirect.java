package com.system.common.util.pageredirect;

public interface InterfaceOfPageRedirect {
    public String pageLoad(String param) throws Exception;
    public String messageMatcher(String content, String lang) throws Exception;
    public String loadErrorPage() throws Exception;
}