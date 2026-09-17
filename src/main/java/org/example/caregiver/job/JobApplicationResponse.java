package org.example.caregiver.job;

import org.example.caregiver.auth.User;

public class JobApplicationResponse {

    private final Long id;
    private final Long jobId;
    private final Long applicantId;
    private final String applicantName;
    private final String applicantEmail;
    private final String status;
    private final String appliedAt;
    private final String hiredStartDate;
    private final String hiredDays;
    private final String hiredHours;
    private final String hiredWorkType;
    private final String hiredWage;
    private final String hiredEmployForm;

    public JobApplicationResponse(JobApplication application, User applicant) {
        this.id = application.getId();
        this.jobId = application.getJobId();
        this.applicantId = application.getApplicantId();
        this.applicantName = applicant != null ? applicant.getName() : null;
        this.applicantEmail = applicant != null ? applicant.getEmail() : null;
        this.status = application.getStatus();
        this.appliedAt = application.getAppliedAt();
        this.hiredStartDate = application.getHiredStartDate();
        this.hiredDays = application.getHiredDays();
        this.hiredHours = application.getHiredHours();
        this.hiredWorkType = application.getHiredWorkType();
        this.hiredWage = application.getHiredWage();
        this.hiredEmployForm = application.getHiredEmployForm();
    }

    public Long getId() {
        return id;
    }

    public Long getJobId() {
        return jobId;
    }

    public Long getApplicantId() {
        return applicantId;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public String getApplicantEmail() {
        return applicantEmail;
    }

    public String getStatus() {
        return status;
    }

    public String getAppliedAt() {
        return appliedAt;
    }

    public String getHiredStartDate() {
        return hiredStartDate;
    }

    public String getHiredDays() {
        return hiredDays;
    }

    public String getHiredHours() {
        return hiredHours;
    }

    public String getHiredWorkType() {
        return hiredWorkType;
    }

    public String getHiredWage() {
        return hiredWage;
    }

    public String getHiredEmployForm() {
        return hiredEmployForm;
    }
}
