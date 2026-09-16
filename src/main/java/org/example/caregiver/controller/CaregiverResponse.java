package org.example.caregiver.controller;

import java.util.List;
import org.example.caregiver.model.Caregiver;
import org.example.caregiver.model.CaregiverWorkHistory;

public class CaregiverResponse {

    public static class WorkHistoryItem {
        private final String place;
        private final String period;
        private final String role;

        public WorkHistoryItem(CaregiverWorkHistory entry) {
            this.place = entry.getPlace();
            this.period = entry.getPeriod();
            this.role = entry.getRole();
        }

        public String getPlace() { return place; }
        public String getPeriod() { return period; }
        public String getRole() { return role; }
    }

    private final Long id;
    private final String name;
    private final String specialty;
    private final int experienceYears;
    private final String experience;
    private final double rating;
    private final String phone;
    private final String regionName;

    private final String gender;
    private final Integer age;
    private final String jobType;
    private final String education;
    private final String workType;
    private final String wageType;
    private final Long wageAmount;
    private final String wishRegion;
    private final String wishHours;
    private final String intro;
    private final String status;
    private final String date;
    private final List<String> certs;
    private final List<String> wishDays;
    private final List<WorkHistoryItem> workHistory;

    public CaregiverResponse(Caregiver caregiver) {
        this.id = caregiver.getId();
        this.name = caregiver.getName();
        this.specialty = caregiver.getSpecialty();
        this.experienceYears = caregiver.getExperienceYears();
        this.experience = experienceLabel(caregiver.getExperienceYears());
        this.rating = caregiver.getRating();
        this.phone = caregiver.getPhone();
        this.regionName = caregiver.getRegion() != null ? caregiver.getRegion().getName() : null;

        this.gender = caregiver.getGender();
        this.age = caregiver.getAge();
        this.jobType = caregiver.getJobType();
        this.education = caregiver.getEducation();
        this.workType = caregiver.getWorkType();
        this.wageType = caregiver.getWageType();
        this.wageAmount = caregiver.getWageAmount();
        this.wishRegion = caregiver.getWishRegion();
        this.wishHours = caregiver.getWishHours();
        this.intro = caregiver.getIntro();
        this.status = caregiver.getStatus();
        this.date = caregiver.getDate();
        this.certs = caregiver.getCerts();
        this.wishDays = caregiver.getWishDays();
        this.workHistory = caregiver.getWorkHistory().stream().map(WorkHistoryItem::new).toList();
    }

    private static String experienceLabel(int years) {
        return years <= 0 ? "신입" : years + "년 이상";
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSpecialty() { return specialty; }
    public int getExperienceYears() { return experienceYears; }
    public String getExperience() { return experience; }
    public double getRating() { return rating; }
    public String getPhone() { return phone; }
    public String getRegionName() { return regionName; }

    public String getGender() { return gender; }
    public Integer getAge() { return age; }
    public String getJobType() { return jobType; }
    public String getEducation() { return education; }
    public String getWorkType() { return workType; }
    public String getWageType() { return wageType; }
    public Long getWageAmount() { return wageAmount; }
    public String getWishRegion() { return wishRegion; }
    public String getWishHours() { return wishHours; }
    public String getIntro() { return intro; }
    public String getStatus() { return status; }
    public String getDate() { return date; }
    public List<String> getCerts() { return certs; }
    public List<String> getWishDays() { return wishDays; }
    public List<WorkHistoryItem> getWorkHistory() { return workHistory; }
}
