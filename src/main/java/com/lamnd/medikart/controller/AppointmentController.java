package com.lamnd.medikart.controller;

import com.lamnd.medikart.annotation.ApiSuccess;
import com.lamnd.medikart.dto.ApiResponse;
import com.lamnd.medikart.dto.AppointmentRequest;
import com.lamnd.medikart.entity.Appointment;
import com.lamnd.medikart.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    @ApiSuccess(code = "APPOINTMENT_LIST", message = "Appointments fetched")
    public List<Appointment> getAll() {
        return appointmentService.getAll();
    }

    @GetMapping("/{id}")
    @ApiSuccess(code = "APPOINTMENT_DETAIL", message = "Appointment fetched")
    public Appointment getById(@PathVariable String id) {
        return appointmentService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Appointment>> create(@RequestBody @Valid AppointmentRequest request) {
        Appointment created = appointmentService.create(request);
        return new ResponseEntity<>(ApiResponse.success(created, "APPOINTMENT_CREATED", "Appointment created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Appointment>> update(@PathVariable String id, @RequestBody @Valid AppointmentRequest request) {
        Appointment updated = appointmentService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "APPOINTMENT_UPDATED", "Appointment updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        appointmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "APPOINTMENT_DELETED", "Appointment deleted"));
    }
}
