package com.lamnd.medikart.controller;

import com.lamnd.medikart.annotation.ApiSuccess;
import com.lamnd.medikart.dto.ApiResponse;
import com.lamnd.medikart.entity.Speciality;
import com.lamnd.medikart.service.SpecialityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialities")
public class SpecialityController {
    @Autowired
    private SpecialityService specialityService;

    @GetMapping
    @ApiSuccess(code = "SPECIALITY_LIST", message = "Specialities fetched")
    public List<Speciality> getAllSpecialities() {
        return specialityService.getAllSpecialities();
    }

    @GetMapping("/{id}")
    @ApiSuccess(code = "SPECIALITY_DETAIL", message = "Speciality fetched")
    public Speciality getSpecialityById(@PathVariable String id) {
        return specialityService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Speciality>> createSpeciality(@RequestBody @Valid Speciality speciality) {
        Speciality created = specialityService.create(speciality);
        return new ResponseEntity<>(ApiResponse.success(created, "SPECIALITY_CREATED", "Speciality created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Speciality>> updateSpeciality(@PathVariable String id, @RequestBody Speciality speciality) {
        Speciality updated = specialityService.update(id, speciality);
        return ResponseEntity.ok(ApiResponse.success(updated, "SPECIALITY_UPDATED", "Speciality updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSpeciality(@PathVariable String id) {
        specialityService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "SPECIALITY_DELETED", "Speciality deleted"));
    }
}
