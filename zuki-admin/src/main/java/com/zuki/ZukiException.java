package com.zuki;

import org.apache.log4j.Logger;

public class ZukiException extends Exception {

    public ZukiException(String message, Throwable cause, Logger logger) {
        super(message, cause);
        logger.error(message, cause);
    }

    public ZukiException(String message, Throwable cause) {
        super(message, cause);
    }
}
