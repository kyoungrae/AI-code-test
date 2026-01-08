package com.gigateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(AuthorizationHeaderFilter.class);
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
            try {
                ServerHttpRequest request = exchange.getRequest();
                String path = request.getURI().getPath();

                // 1. Public Endpoints (로그인, 회원가입, 정적 리소스 등 인증 불필요 경로)
                if (path.startsWith("/api/v1/auth") ||
                        path.startsWith("/common") ||
                        path.startsWith("/assets") || // 정적 리소스 추가
                        path.startsWith("/login") || // 로그인 페이지 추가
                        path.startsWith("/error") ||
                        path.equals("/") ||
                        path.endsWith(".html") ||
                        path.endsWith(".css") ||
                        path.endsWith(".js") ||
                        path.endsWith(".ico") ||
                        path.endsWith(".png") ||
                        path.endsWith(".jpg") ||
                        path.endsWith(".svg")) {
                    return chain.filter(exchange);
                }

                // 설정값 로드 및 검증
                String systemApiKey = env.getProperty("gateway.api-key");
                String jwtSecret = env.getProperty("token.secret");

                if (systemApiKey == null || jwtSecret == null) {
                    logger.error(
                            "CRITICAL: Gateway configuration is missing. token.secret or gateway.api-key is NULL. Check application.yml");
                    return onError(exchange, "Internal Server Configuration Error", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                // 2. API Key 인증 (시스템 간 통신용)
                if (request.getHeaders().containsKey(API_KEY_HEADER)) {
                    String reqApiKey = request.getHeaders().getFirst(API_KEY_HEADER);
                    if (systemApiKey.equals(reqApiKey)) {
                        ServerHttpRequest mutatedRequest = request.mutate()
                                .header("X-System-Auth", "true")
                                .header("X-User-Roles", "SYSTEM_ADMIN")
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    } else {
                        return onError(exchange, "Invalid API Key", HttpStatus.UNAUTHORIZED);
                    }
                }

                // 3. JWT 토큰 인증 (사용자 통신용)
                String jwt = null;

                // 3-1. Header에서 찾기
                if (request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
                        jwt = authorizationHeader.replace("Bearer", "").trim();
                    }
                }

                // 3-2. Cookie에서 찾기 (Header에 없을 경우)
                if (jwt == null && request.getCookies().containsKey("Authorization")) {
                    var cookie = request.getCookies().getFirst("Authorization");
                    if (cookie != null) {
                        String cookieVal = cookie.getValue();
                        // 쿠키 값에 Bearer prefix가 있을 수도 있고 없을 수도 있음.
                        // URL 디코딩이 필요할 수도 있음 (Java의 Cookie는 기본적으로 인코딩됨).
                        // 여기서는 단순 값 추출 후 Bearer 제거 시도
                        jwt = cookieVal.replace("Bearer", "").trim();
                        // 혹시 URL Encoding된 경우 체크 (선택사항, 필요시 Java.net.URLDecoder 사용)
                    }
                }

                // 토큰이 없으면 에러
                if (jwt == null || jwt.isEmpty()) {
                    return onError(exchange, "No Authorization header or cookie", HttpStatus.UNAUTHORIZED);
                }

                if (!isJwtValid(jwt, jwtSecret)) {
                    return onError(exchange, "JWT token is not valid", HttpStatus.UNAUTHORIZED);
                }

                try {
                    Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(jwt).getBody();
                    String userId = claims.getSubject();
                    String userRole = claims.get("role", String.class);
                    // ... (이후 로직 동일)

                    ServerHttpRequest mutatedRequest = request.mutate()
                            .header("X-User-Id", userId)
                            .header("X-User-Roles", userRole)
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                } catch (Exception e) {
                    logger.error("JWT Parsing Error: ", e);
                    return onError(exchange, "JWT token error: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
                }
            } catch (Exception e) {
                logger.error("Unhandled Exception in AuthorizationHeaderFilter: ", e);
                return onError(exchange, "Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        };
    }

    private boolean isJwtValid(String jwt, String secret) {
        try {
            if (secret == null)
                return false;
            Jwts.parser().setSigningKey(secret).parseClaimsJws(jwt);
            return true;
        } catch (Exception e) {
            logger.warn("JWT Validation Failed: {}", e.getMessage());
            return false;
        }
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        logger.error("Authorization Error: {} - Status: {}", err, httpStatus);
        return response.setComplete();
    }
}
