package org.example.caregiver.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class CaregiverWorkHistory {

    private String place;
    private String period;
    private String role;

    public CaregiverWorkHistory() {
    }

    public CaregiverWorkHistory(String place, String period, String role) {
        this.place = place;
        this.period = period;
        this.role = role;
    }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
