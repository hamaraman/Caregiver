package org.example.caregiver.controller;

import org.example.caregiver.model.Caregiver;
import org.example.caregiver.model.RegionQuery;
import org.example.caregiver.repository.CaregiverRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public List<CaregiverResponse> getCaregivers(@RequestParam(required = false) String region) {
        String normalizedRegion = RegionQuery.normalize(region);
        List<Caregiver> caregivers = normalizedRegion == null
                ? caregiverRepository.findAllByOrderByIdDesc()
                : caregiverRepository.findByRegion_NameStartingWithOrderByIdDesc(normalizedRegion);
        return caregivers.stream().map(CaregiverResponse::new).toList();
    }
}
