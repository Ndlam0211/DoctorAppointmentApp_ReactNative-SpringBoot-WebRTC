package com.lamnd.medikart.dto;

import com.lamnd.medikart.entity.TimeSlot;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateDoctorRequest {
    @Size(min = 1, message = "name cannot be blank")
    private String name;
    @Email(message = "email must be valid")
    private String email;
    private String phone;
    private String specialityId;
    private String userId;
    private String image;
    private Float rating;
    private Integer consultationFee;
    private List<TimeSlot> availableSlots;
}
