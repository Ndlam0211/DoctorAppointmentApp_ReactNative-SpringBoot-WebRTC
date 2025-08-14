package com.lamnd.medikart.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "specialities")
public class Speciality {
    @Id
    private String id;
    @Indexed(unique = true)
    @NotBlank(message = "title is required")
    private String title;
    private String description;
}
