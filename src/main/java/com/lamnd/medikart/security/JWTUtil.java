package com.lamnd.medikart.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.lamnd.medikart.config.JWTConfig;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JWTUtil {
    private final JWTConfig jwtConfig;

    public JWTUtil(JWTConfig jwtConfig){
        this.jwtConfig = jwtConfig;
    }

    public String generateToken(String userName) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getExpiresIn());

        return Jwts.builder()
                .setIssuer(jwtConfig.getAppName())
                .setSubject(userName)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSignKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    private Key getSignKey(){
        byte[] keyBytes = Base64.getEncoder().encode(jwtConfig.getSecretKey().getBytes());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public DecodedJWT verifyToken(String token) throws JWTVerificationException {
        Algorithm algorithm = Algorithm.HMAC512(Base64.getEncoder().encode(jwtConfig.getSecretKey().getBytes()));

        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer(jwtConfig.getAppName())
                .build();

        return verifier.verify(token);
    }

    public String getUsernameFromToken(String token) {
        return verifyToken(token).getSubject();
    }
}
