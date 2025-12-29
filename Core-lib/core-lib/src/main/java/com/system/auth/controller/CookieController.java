package com.system.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/common")
public class CookieController {
    @GetMapping("getEmailCookie")
    public ResponseEntity<Map<String, String>> getEmailCookie(
            @CookieValue(name = "remember_email", required = false) String email) {

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("email", email != null ? email : "");

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("setEmailCookie")
    public ResponseEntity<Map<String, String>> setEmailCookie(@RequestBody Map<String, Object> requestParam, HttpServletResponse response) {
        try{
            Cookie emailCookie = null;
            if((Boolean)requestParam.get("isChecked")){
                emailCookie = new Cookie("remember_email", requestParam.get("email").toString());
                emailCookie.setMaxAge(30 * 24 * 60 * 60);   // 30days
                emailCookie.setPath("/");
                emailCookie.setHttpOnly(true);
                emailCookie.setSecure(false);   // todo ssl 인증 적용 뒤 변경 예정
                emailCookie.setAttribute("SameSite", "Strict");
            } else {
                emailCookie = new Cookie("remember_email", "");
                emailCookie.setMaxAge(0);
                emailCookie.setPath("/");
            }

            response.addCookie(emailCookie);
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Set email cookie succeed");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Set email cookie failed");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
