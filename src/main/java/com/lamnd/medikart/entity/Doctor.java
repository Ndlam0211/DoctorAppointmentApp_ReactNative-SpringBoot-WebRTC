package com.lamnd.medikart.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collation = "doctors")
public class Doctor {
    @Id
    private String id;

    private String name;
    private String email;
    private String phone;

    @DBRef
    @NonNull
    private Speciality speciality;

    @DBRef
    @NonNull
    private User user;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String image;
    private float rating;
    private int consultationFee;
    private List<TimeSlot> availableSlots;
}
