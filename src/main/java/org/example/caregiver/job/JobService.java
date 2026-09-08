package org.example.caregiver.job;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobLikeRepository jobLikeRepository;

    public JobService(JobRepository jobRepository, JobLikeRepository jobLikeRepository) {
        this.jobRepository = jobRepository;
        this.jobLikeRepository = jobLikeRepository;
    }

    public List<JobResponse> getJobs(Long viewerUserId) {
        return jobRepository.findAllByOrderByIdDesc().stream()
                .map(job -> toResponse(job, viewerUserId))
                .toList();
    }

    public Optional<JobResponse> getJob(Long id, Long viewerUserId) {
        return jobRepository.findById(id)
                .map(job -> toResponse(job, viewerUserId));
    }

    public JobResponse createJob(JobCreateRequest request) {
        validate(request);
        Job job = new Job(null, request.getTitle(), request.getBadge(), request.getBadgeColor(),
                request.getLocation(), request.getWage(), request.getHours(),
                request.getDays(), request.getDate());
        Job saved = jobRepository.save(job);
        return toResponse(saved, null);
    }

    public Optional<JobResponse> like(Long jobId, Long userId) {
        return jobRepository.findById(jobId)
                .map(job -> {
                    jobLikeRepository.like(userId, jobId);
                    return toResponse(job, userId);
                });
    }

    public Optional<JobResponse> unlike(Long jobId, Long userId) {
        return jobRepository.findById(jobId)
                .map(job -> {
                    jobLikeRepository.unlike(userId, jobId);
                    return toResponse(job, userId);
                });
    }

    private JobResponse toResponse(Job job, Long viewerUserId) {
        return new JobResponse(job, jobLikeRepository.isLiked(viewerUserId, job.getId()));
    }

    private void validate(JobCreateRequest request) {
        if (isBlank(request.getTitle()) || isBlank(request.getLocation()) || isBlank(request.getWage())
                || isBlank(request.getHours()) || isBlank(request.getDays()) || isBlank(request.getDate())) {
            throw new JobException("제목, 지역, 급여, 근무시간, 근무요일, 등록일을 모두 입력해주세요.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
