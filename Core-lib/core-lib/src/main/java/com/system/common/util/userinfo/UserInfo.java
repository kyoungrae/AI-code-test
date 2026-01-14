package com.system.common.util.userinfo;

import com.system.auth.jwt.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class UserInfo {
    JwtService jwtService;

    public static String getUserEmail() throws Exception {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();

                if (principal instanceof UserDetails) {
                    return ((UserDetails) principal).getUsername();
                } else {
                    return principal.toString();
                }
            }
            return null;
        } catch (Exception e) {
            throw new Exception("not find AuthUser Email");
        }
    }

    public static String getUserRoles() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                return authentication.getAuthorities().toString();
            }
        } catch (Exception e) {
            // ignore
        }
        return "";
    }
}
