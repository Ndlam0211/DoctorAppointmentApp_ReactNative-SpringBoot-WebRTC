package com.lamnd.medikart.dto;

import com.lamnd.medikart.entity.User;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateUserRequest {
    @Size(min = 1, message = "name cannot be blank")
    private String name;
    private String image;
    @Size(min = 7, max = 20, message = "phoneNumber length must be 7-20")
    private String phoneNumber;
    private Boolean isActive;
    private List<User.UserRole> roles;
}
