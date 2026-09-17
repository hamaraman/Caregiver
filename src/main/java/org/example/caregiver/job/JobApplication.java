package org.example.caregiver.job;

import jakarta.persistence.*;

@Entity
@Table(name = "job_applications", uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "applicant_id"}))
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "applicant_id", nullable = false)
    private Long applicantId;

    @Column(nullable = false)
    private String status;

    @Column(name = "applied_at", nullable = false)
    private String appliedAt;

    // 채용 확정 후 사업자가 직접 조정하는 근무 조건. 원 공고(Job)의 값과 달라질 수 있어 지원 건마다 별도 보관.
    @Column(name = "hired_start_date")
    private String hiredStartDate;

    @Column(name = "hired_days")
    private String hiredDays;

    @Column(name = "hired_hours")
    private String hiredHours;

    @Column(name = "hired_work_type")
    private String hiredWorkType;

    @Column(name = "hired_wage")
    private String hiredWage;

    @Column(name = "hired_employ_form")
    private String hiredEmployForm;

    public JobApplication() {
    }

    public JobApplication(Long jobId, Long applicantId, String status, String appliedAt) {
        this.jobId = jobId;
        this.applicantId = applicantId;
        this.status = status;
        this.appliedAt = appliedAt;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAppliedAt() {
        return appliedAt;
    }

    public String getHiredStartDate() {
        return hiredStartDate;
    }

    public void setHiredStartDate(String hiredStartDate) {
        this.hiredStartDate = hiredStartDate;
    }

    public String getHiredDays() {
        return hiredDays;
    }

    public void setHiredDays(String hiredDays) {
        this.hiredDays = hiredDays;
    }

    public String getHiredHours() {
        return hiredHours;
    }

    public void setHiredHours(String hiredHours) {
        this.hiredHours = hiredHours;
    }

    public String getHiredWorkType() {
        return hiredWorkType;
    }

    public void setHiredWorkType(String hiredWorkType) {
        this.hiredWorkType = hiredWorkType;
    }

    public String getHiredWage() {
        return hiredWage;
    }

    public void setHiredWage(String hiredWage) {
        this.hiredWage = hiredWage;
    }

    public String getHiredEmployForm() {
        return hiredEmployForm;
    }

    public void setHiredEmployForm(String hiredEmployForm) {
        this.hiredEmployForm = hiredEmployForm;
    }
}
