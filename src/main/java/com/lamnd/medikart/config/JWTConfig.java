package com.lamnd.medikart.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JWTConfig {
    @Value("${jwt.auth.app}")
    private String appName;

    @Value("${jwt.auth.secret_key}")
    private String secretKey;

    @Value("${jwt.auth.expires_in}")
    private int expiresIn;

    public String getSecretKey() {
        return secretKey;
    }

    public int getExpiresIn() { return expiresIn; }

    public String getAppName() {
        return appName;
    }
}
