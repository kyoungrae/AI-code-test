/**
 *  ++ giens Product ++
 */
package com.system.auth.authuser;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthUserService{
    private final AuthUserMapper authUserMapper;

    public Optional<AuthUser> findByUserName(String email) {
        AuthUser user = AuthUser.builder().email(email).build();
        return authUserMapper.SELECT_USER_INFO(user);
    }
    public int save(AuthUser authUser){
        return authUserMapper.INSERT_USER_INFO(authUser);
    }
}