package org.example.caregiver.job;

public class JobLikeCount {

    private final Long jobId;
    private final Long count;

    public JobLikeCount(Long jobId, Long count) {
        this.jobId = jobId;
        this.count = count;
    }

    public Long getJobId() {
        return jobId;
    }

    public Long getCount() {
        return count;
    }
}
