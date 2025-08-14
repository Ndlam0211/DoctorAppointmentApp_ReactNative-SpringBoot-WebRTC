package com.lamnd.medikart.service;

import com.lamnd.medikart.dto.CreateDoctorRequest;
import com.lamnd.medikart.dto.DoctorDTO;
import com.lamnd.medikart.dto.UpdateDoctorRequest;
import com.lamnd.medikart.entity.Doctor;
import com.lamnd.medikart.entity.Speciality;
import com.lamnd.medikart.entity.User;
import com.lamnd.medikart.exception.BadRequestException;
import com.lamnd.medikart.exception.ResourceNotFoundException;
import com.lamnd.medikart.repository.DoctorRepository;
import com.lamnd.medikart.repository.SpecialityRepository;
import com.lamnd.medikart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SpecialityRepository specialityRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DoctorDTO> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();

        return doctors.stream().map(doctor -> DoctorDTO.builder()
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .id(doctor.getId())
                .name(doctor.getName())
                .image(doctor.getImage())
                .availableSlots(doctor.getAvailableSlots())
                .fee(doctor.getConsultationFee())
                .user(doctor.getUser() != null ? doctor.getUser().getId() : null)
                .rating(doctor.getRating())
                .speciality(doctor.getSpeciality() != null ? doctor.getSpeciality().getId() : null)
                .build()).collect(Collectors.toList());
    }

    public Doctor createDoctor(Doctor doctor){
        return doctorRepository.save(doctor);
    }

    public Doctor createDoctor(CreateDoctorRequest request) {
        if (request.getSpecialityId() == null || request.getSpecialityId().isBlank()) {
            throw new BadRequestException("specialityId is required");
        }
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new BadRequestException("userId is required");
        }

        Speciality speciality = specialityRepository.findById(request.getSpecialityId())
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found: " + request.getSpecialityId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));

        Doctor doctor = Doctor.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .speciality(speciality)
                .user(user)
                .image(request.getImage())
                .rating(request.getRating())
                .consultationFee(request.getConsultationFee())
                .availableSlots(request.getAvailableSlots())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(String id, UpdateDoctorRequest req) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor Not Found!"));

        if (req.getName() != null) doctor.setName(req.getName());
        if (req.getEmail() != null) doctor.setEmail(req.getEmail());
        if (req.getPhone() != null) doctor.setPhone(req.getPhone());
        if (req.getImage() != null) doctor.setImage(req.getImage());
        if (req.getRating() != null) doctor.setRating(req.getRating());
        if (req.getConsultationFee() != null) doctor.setConsultationFee(req.getConsultationFee());
        if (req.getAvailableSlots() != null) doctor.setAvailableSlots(req.getAvailableSlots());

        if (req.getSpecialityId() != null) {
            Speciality speciality = specialityRepository.findById(req.getSpecialityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Speciality not found: " + req.getSpecialityId()));
            doctor.setSpeciality(speciality);
        }
        if (req.getUserId() != null) {
            User user = userRepository.findById(req.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));
            doctor.setUser(user);
        }

        doctor.setUpdatedAt(LocalDateTime.now());
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(String id) {
        doctorRepository.deleteById(id);
    }

    public DoctorDTO getDoctorById(String doctorId){
        return doctorRepository.findById(doctorId).map(doctor -> DoctorDTO.builder()
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .id(doctor.getId())
                .name(doctor.getName())
                .image(doctor.getImage())
                .availableSlots(doctor.getAvailableSlots())
                .fee(doctor.getConsultationFee())
                .user(doctor.getUser().getId())
                .rating(doctor.getRating())
                .speciality(doctor.getSpeciality().getId())
                .build())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor Not Found!"));
    }
}
