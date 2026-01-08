package com.gigateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Objects;

@Component
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {
    private final Environment env;

    public AuthorizationHeaderFilter(Environment env) {
        super(Config.class);
        this.env = env;
    }

    public static class Config {

    }

    private static final String API_KEY_HEADER = "X-API-KEY";

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            // 1. Public Endpoints (로그인, 회원가입 등 인증 불필요 경로)
            if (path.startsWith("/api/v1/auth") ||
                    path.startsWith("/common") ||
                    path.startsWith("/error") ||
                    path.equals("/") ||
                    path.endsWith(".html") ||
                    path.endsWith(".css") ||
                    path.endsWith(".js") ||
                    path.endsWith(".ico")) {
                return chain.filter(exchange);
            }

            // 2. API Key 인증 (시스템 간 통신용)
            // application.yml에서 gateway.api-key 값을 읽어옴
            String systemApiKey = env.getProperty("gateway.api-key");

            if (systemApiKey != null && request.getHeaders().containsKey(API_KEY_HEADER)) {
                String reqApiKey = request.getHeaders().getFirst(API_KEY_HEADER);
                if (systemApiKey.equals(reqApiKey)) {
                    // API Key가 유효하면 JWT 검증 없이 통과 (권한 정보를 헤더에 추가하여 전달 가능)
                    ServerHttpRequest mutatedRequest = request.mutate()
                            .header("X-System-Auth", "true")
                            .header("X-User-Roles", "SYSTEM_ADMIN") // 시스템 권한 부여
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                } else {
                    return onError(exchange, "Invalid API Key", HttpStatus.UNAUTHORIZED);
                }
            }

            // 3. JWT 토큰 인증 (사용자 통신용)
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "No Authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authorizationHeader = Objects.requireNonNull(request.getHeaders().get(HttpHeaders.AUTHORIZATION))
                    .get(0);
            String jwt = authorizationHeader.replace("Bearer", "").trim();

            if (!isJwtValid(jwt)) {
                return onError(exchange, "JWT token is not valid", HttpStatus.UNAUTHORIZED);
            }

            try {
                String jwtSecret = env.getProperty("token.secret");
                Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(jwt).getBody();
                String userId = claims.getSubject();
                String userRole = claims.get("role", String.class);

                ServerHttpRequest mutatedRequest = request.mutate()
                        .header("X-User-Id", userId)
                        .header("X-User-Roles", userRole)
                        .build();
                return chain.filter(exchange.mutate().request(mutatedRequest).build());
            } catch (Exception e) {
                return onError(exchange, "JWT token error: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private boolean isJwtValid(String jwt) {
        try {
            String jwtSecret = env.getProperty("token.secret");
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(jwt);
            return true;
        } catch (Exception e) {
            System.err.println("JWT Validation Error: " + e.getMessage());
            return false;
        }
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

}
