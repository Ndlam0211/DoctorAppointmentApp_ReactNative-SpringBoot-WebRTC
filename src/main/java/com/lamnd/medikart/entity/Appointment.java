package com.lamnd.medikart.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collation = "appointments")
public class Appointment {

    @Id
    private String id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AppointmentStatus status;

    @DBRef
    private Doctor doctor;
    @DBRef
    private User user;
    @DBRef
    private Patient patient;

    public enum AppointmentStatus {
        SCHEDULED,
        CANCELED,
        COMPLETED,
        CONFIRMED
    }
}
