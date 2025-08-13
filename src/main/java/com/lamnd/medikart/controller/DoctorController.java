package com.lamnd.medikart.controller;

import com.lamnd.medikart.dto.DoctorDTO;
import com.lamnd.medikart.entity.Doctor;
import com.lamnd.medikart.service.DoctorService;
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
    public List<DoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping
    public DoctorDTO getDoctorById(@PathVariable String doctorId) {
        return doctorService.getDoctorById(doctorId);
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(Doctor doctor){
        return new ResponseEntity<>(doctorService.createDoctor(doctor), HttpStatus.CREATED);
    }
}
