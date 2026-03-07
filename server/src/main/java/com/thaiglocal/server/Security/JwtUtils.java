package com.thaiglocal.server.Security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JwtUtils {
    @Value("${jwt.access-secret}")
    private String accessSecret;

    @Value("${jwt.refresh-secret")
    private String refreshSecret;

    private final long ACCESS_TOKEN_VALIDITY_MS = 5 * 1000; // 15 minute
    private final long REFRESH_TOKEN_VALIDITY_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days

    private Key getAccessSigningKey() {
        return Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
    }

    private Key getRefreshSigninKey() {
        return Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
    }

    public Long extrackUserId(String token, Boolean isAccess) {
        Claims claims = Jwts.parserBuilder()
        .setSigningKey(isAccess ? getAccessSigningKey() : getRefreshSigninKey())
        .build()
        .parseClaimsJws(token)
        .getBody();

        return Long.parseLong(claims.getSubject());
    }

    private boolean isTokenExpired(Date expiration) {
        return expiration.before(new Date());
    }

    public String genrateAccessToken(String userId) {
        return Jwts.builder()
            .setSubject(userId)
            .claim("type", "access")
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_MS))
            .signWith(getAccessSigningKey(), SignatureAlgorithm.HS512)
            .compact();
    }

    public String generateRefreshToken(String userId) {
        return Jwts.builder()
            .setSubject(userId)
            .claim("type", "refresh")
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY_MS))
            .signWith(getAccessSigningKey(), SignatureAlgorithm.HS512)
            .compact();
    }

    private boolean validateTokenWithKey(String token, Key key, String expectedType) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

            String type = claims.get("type", String.class);
            return expectedType.equals(type) && !isTokenExpired(claims.getExpiration());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateAccessToken(String token) {
        return validateTokenWithKey(token, getAccessSigningKey(), "access");
    }

    public boolean validateRefreshToken(String token) {
        return validateTokenWithKey(token, getAccessSigningKey(), "refresh");
    }

    public String refreshAccessToken(String refreshToken) {
        if (!validateAccessToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token.");
        }

        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getRefreshSigninKey())
            .build()
            .parseClaimsJws(refreshToken)
            .getBody();

        String userId = claims.getSubject();
        return genrateAccessToken(userId);
    }
}
