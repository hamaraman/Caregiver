package org.example.caregiver.resume;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class JobSeekerProfileRequest {

    private String name;
    private String phone;
    private String birth;
    private String region;
    private String workRegion;
    private List<String> workTypes;
    private String salary;
    private String cert;
    private boolean isNew;
    private String expPeriod;
    private String intro;

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
        this.workTypes = workTypes;
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

    @JsonProperty("isNew")
    public boolean isNew() {
        return isNew;
    }

    @JsonProperty("isNew")
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
