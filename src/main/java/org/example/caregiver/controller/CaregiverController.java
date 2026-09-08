package org.example.caregiver.controller;

import org.example.caregiver.model.Caregiver;
import org.example.caregiver.repository.CaregiverRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/caregivers")
public class CaregiverController {

    private final CaregiverRepository caregiverRepository;

    public CaregiverController(CaregiverRepository caregiverRepository) {
        this.caregiverRepository = caregiverRepository;
    }

    @GetMapping
    public List<Caregiver> getCaregivers() {
        return caregiverRepository.findAll();
    }
}
