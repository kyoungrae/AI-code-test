package com.system.auth.service;

import com.system.auth.authuser.AuthUser;
import com.system.auth.authuser.AuthUserService;
import com.system.auth.authuser.Role;
import com.system.auth.domain.Token;
import com.system.auth.domain.TokenType;
import com.system.auth.dto.AuthenticationRequest;
import com.system.auth.dto.AuthenticationResponse;
import com.system.auth.dto.RegisterRequest;
import com.system.auth.jwt.JwtService;
import com.system.auth.token.TokenService;
import com.system.common.util.userinfo.UserInfo;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
@Service
@AllArgsConstructor
public class AuthenticationService {
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthUserService AuthUserService;
    private final SequenceService sequenceService;

    @Transactional(rollbackFor =  Exception.class)
    public AuthenticationResponse register(RegisterRequest request) throws Exception {
        UserInfo userInfo = new UserInfo();
        LocalDateTime localDateTime = LocalDateTime.now();
        Timestamp timestamp = Timestamp.valueOf(localDateTime);

        int token_seq = sequenceService.selectTokenSequence();
        var user = AuthUser.builder()
                .id(token_seq)
                .user_id(request.getUser_id())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .system_create_userid(userInfo.getUserEmail())
                .system_create_date(timestamp)
                .build();
        AuthUserService.save(user);
        var jwtToken = jwtService.generateToken(user);
        var token = Token.builder()
                .id(token_seq)
                .token(jwtToken)
                .token_type(TokenType.AUTHORIZATION)
                .auth_user(user)
                .build();
        tokenService.save(token);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
    public AuthenticationResponse authenticate(AuthenticationRequest request){
        try {
            var authToken = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());

            var authentication = authenticationManager.authenticate(authToken);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            var user = (AuthUser) authentication.getPrincipal();

            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 확인
            throw e;              // 혹은 ResponseEntity.status(401).body("인증 실패")
        }
    }
}
