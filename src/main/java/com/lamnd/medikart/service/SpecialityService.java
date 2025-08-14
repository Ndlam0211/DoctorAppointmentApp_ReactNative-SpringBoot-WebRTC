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

    public Speciality getById(String id) {
        return specialityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Speciality Not Found!"));
    }

    public Speciality create(Speciality speciality) {
        return specialityRepository.save(speciality);
    }

    public Speciality update(String id, Speciality req) {
        Speciality sp = getById(id);
        if (req.getTitle() != null) sp.setTitle(req.getTitle());
        if (req.getDescription() != null) sp.setDescription(req.getDescription());
        return specialityRepository.save(sp);
    }

    public void delete(String id) {
        specialityRepository.deleteById(id);
    }
}
