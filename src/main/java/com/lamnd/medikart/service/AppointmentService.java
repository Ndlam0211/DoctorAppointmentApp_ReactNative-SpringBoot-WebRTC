package com.lamnd.medikart.service;

import com.lamnd.medikart.dto.AppointmentRequest;
import com.lamnd.medikart.entity.Appointment;
import com.lamnd.medikart.entity.Doctor;
import com.lamnd.medikart.entity.Patient;
import com.lamnd.medikart.entity.User;
import com.lamnd.medikart.exception.BadRequestException;
import com.lamnd.medikart.exception.ResourceNotFoundException;
import com.lamnd.medikart.repository.AppointmentRepository;
import com.lamnd.medikart.repository.DoctorRepository;
import com.lamnd.medikart.repository.PatientRepository;
import com.lamnd.medikart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PatientRepository patientRepository;

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    public Appointment getById(String id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment Not Found!"));
    }

    public Appointment create(AppointmentRequest req) {
        if (req.getStartTime().isAfter(req.getEndTime()) || req.getStartTime().isEqual(req.getEndTime())) {
            throw new BadRequestException("startTime must be before endTime");
        }
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + req.getDoctorId()));
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + req.getPatientId()));

        Appointment appt = Appointment.builder()
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .status(req.getStatus() != null ? req.getStatus() : Appointment.AppointmentStatus.SCHEDULED)
                .doctor(doctor)
                .user(user)
                .patient(patient)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return appointmentRepository.save(appt);
    }

    public Appointment update(String id, AppointmentRequest req) {
        Appointment appt = getById(id);

        if (req.getDoctorId() != null) {
            appt.setDoctor(doctorRepository.findById(req.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + req.getDoctorId())));
        }
        if (req.getUserId() != null) {
            appt.setUser(userRepository.findById(req.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId())));
        }
        if (req.getPatientId() != null) {
            appt.setPatient(patientRepository.findById(req.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + req.getPatientId())));
        }
        if (req.getStartTime() != null) appt.setStartTime(req.getStartTime());
        if (req.getEndTime() != null) appt.setEndTime(req.getEndTime());
        if (req.getStatus() != null) appt.setStatus(req.getStatus());

        if (appt.getStartTime() != null && appt.getEndTime() != null &&
                (appt.getStartTime().isAfter(appt.getEndTime()) || appt.getStartTime().isEqual(appt.getEndTime()))) {
            throw new BadRequestException("startTime must be before endTime");
        }

        appt.setUpdatedAt(LocalDateTime.now());
        return appointmentRepository.save(appt);
    }

    public void delete(String id) {
        appointmentRepository.deleteById(id);
    }
}
