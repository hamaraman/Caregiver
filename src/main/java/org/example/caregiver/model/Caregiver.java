package org.example.caregiver.model;

import jakarta.persistence.*;
import org.example.caregiver.auth.User;

@Entity
@Table(name = "caregivers")
public class Caregiver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // User에도 name이 있지만 프론트 요구사항 맞추기 위해 둠
    private String specialty;
    private int experienceYears;
    private double rating;
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    public Caregiver() {}

    public Caregiver(String name, String specialty, int experienceYears, double rating, String phone, User owner, Region region) {
        this.name = name;
        this.specialty = specialty;
        this.experienceYears = experienceYears;
        this.rating = rating;
        this.phone = phone;
        this.owner = owner;
        this.region = region;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
}
