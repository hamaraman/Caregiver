package org.example.caregiver.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
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

    // 인재 목록/상세 화면에서 쓰는 선택 필드 (모두 nullable)
    private String gender;
    private Integer age;
    private String jobType;
    private String education;
    private String workType;
    private String wageType;
    private Long wageAmount;
    private String wishRegion;
    private String wishHours;

    @Column(length = 1000)
    private String intro;

    private String status;
    private String date;

    @ElementCollection
    @CollectionTable(name = "caregiver_certs", joinColumns = @JoinColumn(name = "caregiver_id"))
    @Column(name = "cert")
    private List<String> certs = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "caregiver_wish_days", joinColumns = @JoinColumn(name = "caregiver_id"))
    @Column(name = "wish_day")
    private List<String> wishDays = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "caregiver_work_history", joinColumns = @JoinColumn(name = "caregiver_id"))
    private List<CaregiverWorkHistory> workHistory = new ArrayList<>();

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

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getWorkType() { return workType; }
    public void setWorkType(String workType) { this.workType = workType; }
    public String getWageType() { return wageType; }
    public void setWageType(String wageType) { this.wageType = wageType; }
    public Long getWageAmount() { return wageAmount; }
    public void setWageAmount(Long wageAmount) { this.wageAmount = wageAmount; }
    public String getWishRegion() { return wishRegion; }
    public void setWishRegion(String wishRegion) { this.wishRegion = wishRegion; }
    public String getWishHours() { return wishHours; }
    public void setWishHours(String wishHours) { this.wishHours = wishHours; }
    public String getIntro() { return intro; }
    public void setIntro(String intro) { this.intro = intro; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public List<String> getCerts() { return certs; }
    public void setCerts(List<String> certs) { this.certs = certs != null ? certs : new ArrayList<>(); }
    public List<String> getWishDays() { return wishDays; }
    public void setWishDays(List<String> wishDays) { this.wishDays = wishDays != null ? wishDays : new ArrayList<>(); }
    public List<CaregiverWorkHistory> getWorkHistory() { return workHistory; }
    public void setWorkHistory(List<CaregiverWorkHistory> workHistory) { this.workHistory = workHistory != null ? workHistory : new ArrayList<>(); }
}
