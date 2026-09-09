package org.example.caregiver.controller;

import org.example.caregiver.model.Caregiver;

public class CaregiverResponse {

    private final Long id;
    private final String name;
    private final String specialty;
    private final int experienceYears;
    private final double rating;
    private final String phone;
    private final String regionName;

    public CaregiverResponse(Caregiver caregiver) {
        this.id = caregiver.getId();
        this.name = caregiver.getName();
        this.specialty = caregiver.getSpecialty();
        this.experienceYears = caregiver.getExperienceYears();
        this.rating = caregiver.getRating();
        this.phone = caregiver.getPhone();
        this.regionName = caregiver.getRegion() != null ? caregiver.getRegion().getName() : null;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSpecialty() { return specialty; }
    public int getExperienceYears() { return experienceYears; }
    public double getRating() { return rating; }
    public String getPhone() { return phone; }
    public String getRegionName() { return regionName; }
}
