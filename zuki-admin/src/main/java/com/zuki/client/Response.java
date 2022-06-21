package com.zuki.client;

import java.util.Map;

public class Response<T> {
    T entity;
    Map<String,String> validationMessages;
    String exception;

    public Response() {
    }

    
    public T getEntity() {
        return entity;
    }

    public Map<String, String> getValidationMessages() {
        return validationMessages;
    }


    public void setEntity(T entity) {
        this.entity = entity;
    }


    public void setValidationMessages(Map<String, String> validationMessages) {
        this.validationMessages = validationMessages;
    }

    public String getException() {
        return exception;
    }
    
}