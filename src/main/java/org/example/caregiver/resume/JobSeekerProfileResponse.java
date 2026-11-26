package org.example.caregiver.resume;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class JobSeekerProfileResponse {

    private final Long id;
    private final String name;
    private final String phone;
    private final String birth;
    private final String gender;
    private final String region;
    private final String date;
    private final String workRegion;
    private final List<String> workTypes;
    private final String salary;
    private final String cert;
    private final boolean isNew;
    private final String expPeriod;
    private final String intro;

    public JobSeekerProfileResponse(JobSeekerProfile profile) {
        this(profile, true);
    }

    // 공개 목록/상세처럼 로그인·권한 확인 없이 내려가는 응답에는 연락처를 넣지 않는다.
    public static JobSeekerProfileResponse withoutContact(JobSeekerProfile profile) {
        return new JobSeekerProfileResponse(profile, false);
    }

    private JobSeekerProfileResponse(JobSeekerProfile profile, boolean includeContact) {
        this.id = profile.getId();
        this.name = profile.getName();
        this.phone = includeContact ? profile.getPhone() : null;
        this.birth = profile.getBirth();
        this.gender = profile.getGender();
        this.region = profile.getRegion();
        this.date = profile.getDate();
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

    public String getGender() {
        return gender;
    }

    public String getRegion() {
        return region;
    }

    public String getDate() {
        return date;
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
