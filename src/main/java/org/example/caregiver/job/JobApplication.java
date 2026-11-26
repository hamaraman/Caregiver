package org.example.caregiver.job;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
import org.example.caregiver.auth.User;

import jakarta.persistence.*;

@Entity
@Table(name = "job_applications", uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "applicant_id"}))
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 컬럼은 그대로(job_id, applicant_id) 두고 연관관계로 바꿔 외래키를 건다. 공고·회원이 지워져도 지원 내역이 고아로 남지 않게.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Column(nullable = false)
    private String status;

    @Column(name = "applied_at", nullable = false)
    private String appliedAt;

    @Column(name = "applied_on")
    private LocalDate appliedOn;

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

    public JobApplication(Job job, User applicant, String status, String appliedAt) {
        this.job = job;
        this.applicant = applicant;
        this.status = status;
        this.appliedAt = appliedAt;
        this.appliedOn = Job.fromMonthDay(appliedAt, LocalDate.now());
    }

    public Long getId() {
        return id;
    }

    public Job getJob() {
        return job;
    }

    public User getApplicant() {
        return applicant;
    }

    // LAZY 프록시에서 getId()는 DB 조회 없이 FK 값만 돌려준다.
    public Long getJobId() {
        return job.getId();
    }

    public Long getApplicantId() {
        return applicant.getId();
    }

    public LocalDate getAppliedOn() {
        return appliedOn;
    }

    public void setAppliedOn(LocalDate appliedOn) {
        this.appliedOn = appliedOn;
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
