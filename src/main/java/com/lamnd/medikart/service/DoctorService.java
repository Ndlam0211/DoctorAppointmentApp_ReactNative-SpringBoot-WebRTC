package com.lamnd.medikart.service;

import com.lamnd.medikart.dto.DoctorDTO;
import com.lamnd.medikart.entity.Doctor;
import com.lamnd.medikart.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;

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
                .user(doctor.getUser().getId())
                .rating(doctor.getRating())
                .speciality(doctor.getSpeciality().getId())
                .build()).collect(Collectors.toList());
    }

    public Doctor createDoctor(Doctor doctor){
        return doctorRepository.save(doctor);
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
                .orElseThrow(() -> new RuntimeException("Doctor Not Found!"));
    }
}
