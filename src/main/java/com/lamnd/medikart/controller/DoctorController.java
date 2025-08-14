package com.lamnd.medikart.controller;

import com.lamnd.medikart.annotation.ApiSuccess;
import com.lamnd.medikart.dto.ApiResponse;
import com.lamnd.medikart.dto.CreateDoctorRequest;
import com.lamnd.medikart.dto.DoctorDTO;
import com.lamnd.medikart.dto.UpdateDoctorRequest;
import com.lamnd.medikart.entity.Doctor;
import com.lamnd.medikart.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    @Autowired
    private DoctorService doctorService;

    @GetMapping
    @ApiSuccess(code = "DOCTOR_LIST", message = "Doctors fetched")
    public List<DoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{doctorId}")
    @ApiSuccess(code = "DOCTOR_DETAIL", message = "Doctor fetched")
    public DoctorDTO getDoctorById(@PathVariable String doctorId) {
        return doctorService.getDoctorById(doctorId);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Doctor>> createDoctor(@RequestBody @Valid CreateDoctorRequest request){
        Doctor created = doctorService.createDoctor(request);
        return new ResponseEntity<>(ApiResponse.success(created, "DOCTOR_CREATED", "Doctor created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> updateDoctor(@PathVariable String id, @RequestBody @Valid UpdateDoctorRequest request) {
        Doctor updated = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "DOCTOR_UPDATED", "Doctor updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success(null, "DOCTOR_DELETED", "Doctor deleted"));
    }
}
