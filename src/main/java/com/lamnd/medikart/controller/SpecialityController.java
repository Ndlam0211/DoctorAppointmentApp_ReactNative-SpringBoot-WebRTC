package com.lamnd.medikart.controller;

import com.lamnd.medikart.entity.Speciality;
import com.lamnd.medikart.service.SpecialityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/specialities")
public class SpecialityController {
    @Autowired
    private SpecialityService specialityService;

    @GetMapping
    public List<Speciality> getAllSpecialities() {
        return specialityService.getAllSpecialities();
    }
}
