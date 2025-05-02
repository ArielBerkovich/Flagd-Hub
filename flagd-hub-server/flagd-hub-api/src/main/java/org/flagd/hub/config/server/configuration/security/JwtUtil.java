package org.flagd.hub.config.server.configuration.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY = System.getenv("SECRET_KEY");
    private static final long EXPIRATION_TIME = Duration.ofHours(Integer.parseInt(System.getenv("TOKEN_EXPIRATION_IN_HOURS"))).toMillis();

    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(Date.from(Instant.now().plusMillis(EXPIRATION_TIME)))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static String validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
