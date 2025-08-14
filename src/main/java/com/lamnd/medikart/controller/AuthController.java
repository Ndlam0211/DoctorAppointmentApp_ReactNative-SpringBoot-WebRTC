package com.lamnd.medikart.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.lamnd.medikart.annotation.ApiSuccess;
import com.lamnd.medikart.dto.ApiResponse;
import com.lamnd.medikart.dto.AuthResponse;
import com.lamnd.medikart.dto.CredentialDTO;
import com.lamnd.medikart.entity.User;
import com.lamnd.medikart.exception.BadRequestException;
import com.lamnd.medikart.security.JWTUtil;
import com.lamnd.medikart.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${google.client.id}")
    private String clientId;

    @Autowired
    private UserService userService;

    @Autowired
    private JWTUtil jwtUtil;

    @PostMapping("/google-login")
    @ApiSuccess(code = "LOGIN_SUCCESS", message = "Login successful")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("idToken")) {
            throw new BadRequestException("Google ID Token is required");
        }
        if (clientId == null || clientId.isEmpty()) {
            throw new BadRequestException("Google Client ID is not configured");
        }
        try {
            JsonFactory jsonFactory = new GsonFactory();

            String idToken = (String) request.get("idToken");
            if (idToken == null || idToken.isEmpty()) {
                throw new BadRequestException("Google ID Token is required");
            }
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), jsonFactory)
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken != null) {
                GoogleIdToken.Payload payload = googleIdToken.getPayload();

                if(!payload.getAudience().equals(clientId)) {
                    throw new BadRequestException("Invalid audience(clientId) in Google ID Token");
                }

                String email = payload.getEmail();
                if (email == null || email.isEmpty()) {
                    throw new BadRequestException("No email found in Google ID Token");
                }

                User user = userService.getUserByEmail(email);
                String token = jwtUtil.generateToken(email);
                AuthResponse authResponse = AuthResponse.builder()
                        .token(token).build();

                if(user != null && user.getUsername().equals(email)) {
                    return ResponseEntity.ok(ApiResponse.success(authResponse, "LOGIN_SUCCESS", "Login successful"));
                } else {
                    userService.createUser(payload);
                    return ResponseEntity.ok(ApiResponse.success(authResponse, "REGISTERED", "User registered and logged in"));
                }
            }

            throw new BadRequestException("Invalid Google ID Token");
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @PostMapping("/signup")
    @ApiSuccess(code = "SIGNUP_SUCCESS", message = "Signup successful")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@RequestBody @Valid CredentialDTO dto) {
        // Optional pre-check; unique index will also guard
        if (userService.getUserByEmail(dto.getEmail()) != null) {
            throw new BadRequestException("Email already in use");
        }
        User created = userService.createLocalUser(dto);
        String token = jwtUtil.generateToken(created.getEmail());
        AuthResponse body = AuthResponse.builder().token(token).build();
        return new ResponseEntity<>(ApiResponse.success(body, "SIGNUP_SUCCESS", "Signup successful"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @ApiSuccess(code = "LOGIN_SUCCESS", message = "Login successful")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody @Valid CredentialDTO dto) {
        User user = userService.validateCredentials(dto);
        String token = jwtUtil.generateToken(user.getEmail());
        AuthResponse body = AuthResponse.builder().token(token).build();
        return ResponseEntity.ok(ApiResponse.success(body, "LOGIN_SUCCESS", "Login successful"));
    }
}
