package com.lamnd.medikart.dto;

import com.lamnd.medikart.entity.Appointment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull(message = "startTime is required")
    private LocalDateTime startTime;
    @NotNull(message = "endTime is required")
    private LocalDateTime endTime;
    private Appointment.AppointmentStatus status; // optional
    @NotBlank(message = "doctorId is required")
    private String doctorId;
    @NotBlank(message = "userId is required")
    private String userId;
    @NotBlank(message = "patientId is required")
    private String patientId;
}
