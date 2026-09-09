package org.example.caregiver.resume;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_seeker_profiles")
public class JobSeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    private String name;
    private String phone;
    private String birth;
    private String region;
    private String workRegion;

    @ElementCollection
    @CollectionTable(name = "job_seeker_profile_work_types", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "work_type")
    private List<String> workTypes = new ArrayList<>();

    private String salary;
    private String cert;
    private boolean isNew;
    private String expPeriod;

    @Column(length = 1000)
    private String intro;

    public JobSeekerProfile() {
    }

    public JobSeekerProfile(Long userId, String name, String phone, String birth, String region, String workRegion,
                             List<String> workTypes, String salary, String cert, boolean isNew, String expPeriod,
                             String intro) {
        this.userId = userId;
        this.name = name;
        this.phone = phone;
        this.birth = birth;
        this.region = region;
        this.workRegion = workRegion;
        this.workTypes = workTypes != null ? workTypes : new ArrayList<>();
        this.salary = salary;
        this.cert = cert;
        this.isNew = isNew;
        this.expPeriod = expPeriod;
        this.intro = intro;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBirth() {
        return birth;
    }

    public void setBirth(String birth) {
        this.birth = birth;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getWorkRegion() {
        return workRegion;
    }

    public void setWorkRegion(String workRegion) {
        this.workRegion = workRegion;
    }

    public List<String> getWorkTypes() {
        return workTypes;
    }

    public void setWorkTypes(List<String> workTypes) {
        this.workTypes = workTypes != null ? workTypes : new ArrayList<>();
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getCert() {
        return cert;
    }

    public void setCert(String cert) {
        this.cert = cert;
    }

    public boolean isNew() {
        return isNew;
    }

    public void setNew(boolean isNew) {
        this.isNew = isNew;
    }

    public String getExpPeriod() {
        return expPeriod;
    }

    public void setExpPeriod(String expPeriod) {
        this.expPeriod = expPeriod;
    }

    public String getIntro() {
        return intro;
    }

    public void setIntro(String intro) {
        this.intro = intro;
    }
}
