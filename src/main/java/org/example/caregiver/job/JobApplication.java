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
}
