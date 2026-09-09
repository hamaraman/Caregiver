package org.example.caregiver.resume;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class JobSeekerProfileResponse {

    private final Long id;
    private final String name;
    private final String phone;
    private final String birth;
    private final String region;
    private final String workRegion;
    private final List<String> workTypes;
    private final String salary;
    private final String cert;
    private final boolean isNew;
    private final String expPeriod;
    private final String intro;

    public JobSeekerProfileResponse(JobSeekerProfile profile) {
        this.id = profile.getId();
        this.name = profile.getName();
        this.phone = profile.getPhone();
        this.birth = profile.getBirth();
        this.region = profile.getRegion();
        this.workRegion = profile.getWorkRegion();
        this.workTypes = profile.getWorkTypes();
        this.salary = profile.getSalary();
        this.cert = profile.getCert();
        this.isNew = profile.isNew();
        this.expPeriod = profile.getExpPeriod();
        this.intro = profile.getIntro();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getBirth() {
        return birth;
    }

    public String getRegion() {
        return region;
    }

    public String getWorkRegion() {
        return workRegion;
    }

    public List<String> getWorkTypes() {
        return workTypes;
    }

    public String getSalary() {
        return salary;
    }

    public String getCert() {
        return cert;
    }

    @JsonProperty("isNew")
    public boolean isNew() {
        return isNew;
    }

    public String getExpPeriod() {
        return expPeriod;
    }

    public String getIntro() {
        return intro;
    }
}
