package com.zuki;

import java.util.Collections;
import java.util.Map;

public class Response {
    Object entity;
    Map<String, ErrorEnum> validationMessages;
    String exception;

    public Response() {
    }

    public Response(Object entity) {
        this.entity = entity;        
    }

    public Response(Map<String, ErrorEnum> validationMessages) {
        this.validationMessages = Collections.unmodifiableMap(validationMessages == null ? Map.of() : validationMessages);
    }    

    public Response(Throwable cause) {
        this.validationMessages = Collections.unmodifiableMap(Map.of());
        this.exception = exceptionMessage(cause);
    }

    private static String exceptionMessage(Throwable cause) {
        return cause.getClass().getName() + '/' + cause.getMessage();
    }
    public Response(Map<String, ErrorEnum> validationMessages, Object entity) {
        this.entity = entity;        
        this.validationMessages = Collections.unmodifiableMap(validationMessages == null ? Map.of() : validationMessages);
    }

    public Response(Map<String, ErrorEnum> validationMessages, Throwable cause) {
        this.validationMessages = Collections.unmodifiableMap(validationMessages == null ? Map.of() : validationMessages);
        this.exception = exceptionMessage(cause);
    }    

    public Response(Map<String, ErrorEnum> validationMessages, Object entity, Throwable cause) {
        this.entity = entity;        
        this.validationMessages = Collections.unmodifiableMap(validationMessages == null ? Map.of() : validationMessages);
        this.exception =  exceptionMessage(cause);
    }

    public Object getEntity() {
        return entity;
    }

    public Map<String, ErrorEnum> getValidationMessages() {
        return validationMessages;
    }

    public String getException() {
        return exception;
    }
    
}
