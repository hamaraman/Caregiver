package org.example.caregiver.job;

import org.springframework.stereotype.Repository;

@Repository
public class JobLikeRepository {

    private final JobLikeJpaRepository jobLikeJpaRepository;

    public JobLikeRepository(JobLikeJpaRepository jobLikeJpaRepository) {
        this.jobLikeJpaRepository = jobLikeJpaRepository;
    }

    public boolean isLiked(Long userId, Long jobId) {
        if (userId == null) {
            return false;
        }
        return jobLikeJpaRepository.existsByJobIdAndUserId(jobId, userId);
    }

    public void like(Long userId, Long jobId) {
        if (!jobLikeJpaRepository.existsByJobIdAndUserId(jobId, userId)) {
            jobLikeJpaRepository.save(new JobLike(jobId, userId));
        }
    }

    public void unlike(Long userId, Long jobId) {
        jobLikeJpaRepository.deleteByJobIdAndUserId(jobId, userId);
    }
}
