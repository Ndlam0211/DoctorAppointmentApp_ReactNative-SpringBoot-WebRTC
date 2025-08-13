package com.lamnd.medikart.dto;

import com.lamnd.medikart.entity.Speciality;
import com.lamnd.medikart.entity.TimeSlot;
import com.lamnd.medikart.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String speciality;
    private String user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String image;
    private float rating;
    private int fee;
    private List<TimeSlot> availableSlots;
}
