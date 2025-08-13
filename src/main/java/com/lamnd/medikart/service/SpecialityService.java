package com.lamnd.medikart.service;

import com.lamnd.medikart.entity.Speciality;
import com.lamnd.medikart.repository.SpecialityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialityService {
    @Autowired
    private SpecialityRepository specialityRepository;

    public List<Speciality> getAllSpecialities() {
        return specialityRepository.findAll();
    }
}
