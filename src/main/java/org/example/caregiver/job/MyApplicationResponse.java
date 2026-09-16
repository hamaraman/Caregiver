package org.example.caregiver.job;

public class MyApplicationResponse {

    private final Long id;
    private final String status;
    private final String appliedAt;
    private final JobResponse job;

    public MyApplicationResponse(JobApplication application, Job job) {
        this.id = application.getId();
        this.status = application.getStatus();
        this.appliedAt = application.getAppliedAt();
        this.job = job != null ? new JobResponse(job, false) : null;
    }

    public Long getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public String getAppliedAt() {
        return appliedAt;
    }

    public JobResponse getJob() {
        return job;
    }
}
