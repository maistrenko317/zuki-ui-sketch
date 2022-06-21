package com.zuki;

import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.logging.log4j.spi.AbstractLogger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


public class AbstractController {
    public static final String GET_REQUEST_NOT_FULFILLED = "Can't fulfill get request due to system errors";
    
    private static final Logger logger = Logger.getLogger(AbstractLogger.class);
    public ResponseEntity<Response> reportException(Exception e, Object body, String logMessage) {
        logger.error(logMessage, e);

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new Response(
                Map.of(),
                String.format(
                    "exception:%s, message: %s",
                    e.getClass().getName(),
                    e.getMessage()
                )
            )); 
    }

}
