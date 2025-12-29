package com.system.auth.dto;

import com.system.auth.authuser.AuthUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
@RequiredArgsConstructor
public class RegisterRequest extends AuthUser {
    private String user_id;
    private String email;
    private String password;
}
