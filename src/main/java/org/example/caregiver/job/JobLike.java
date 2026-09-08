package org.example.caregiver.job;

import jakarta.persistence.*;

@Entity
@Table(name = "job_likes", uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "user_id"}))
public class JobLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public JobLike() {
    }

    public JobLike(Long jobId, Long userId) {
        this.jobId = jobId;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public Long getJobId() {
        return jobId;
    }

    public Long getUserId() {
        return userId;
    }
}
