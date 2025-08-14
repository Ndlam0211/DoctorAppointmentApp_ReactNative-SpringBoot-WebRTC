package com.lamnd.medikart.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CredentialDTO {
    @Email(message = "email must be valid")
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, max = 100, message = "password length must be 6-100")
    private String password;

    // Optional for signup; ignored for login
    private String name;
}

