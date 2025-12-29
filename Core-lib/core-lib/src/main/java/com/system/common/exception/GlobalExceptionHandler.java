package com.system.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> handlerCustomException(CustomException ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<String> handleNoResourceFoundException(Exception ex) {
        try {
            String htmlContent = new String(Files.readAllBytes(Paths.get("src/main/resources/templates/page/common/404.html")));

            return new ResponseEntity<>(htmlContent, HttpStatus.NOT_FOUND);
        } catch (IOException e) {
            return new ResponseEntity<>("An unexpected error occurred while loading the error page.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex){
        return new ResponseEntity<>("An unexpected error occurred:"+ex.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
