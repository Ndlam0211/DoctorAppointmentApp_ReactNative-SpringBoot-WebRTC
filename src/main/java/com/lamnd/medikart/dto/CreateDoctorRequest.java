package com.lamnd.medikart.dto;

import com.lamnd.medikart.entity.TimeSlot;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateDoctorRequest {
    @NotBlank(message = "name is required")
    private String name;
    @Email(message = "email must be valid")
    private String email;
    private String phone;
    @NotBlank(message = "specialityId is required")
    private String specialityId;
    @NotBlank(message = "userId is required")
    private String userId; // owner user
    private String image;
    private float rating;
    private int consultationFee;
    @NotNull(message = "availableSlots is required")
    private List<TimeSlot> availableSlots;
}
