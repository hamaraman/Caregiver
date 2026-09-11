package org.example.caregiver.job;

import org.springframework.dao.DataIntegrityViolationException;
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
        if (jobLikeJpaRepository.existsByJobIdAndUserId(jobId, userId)) {
            return;
        }
        try {
            jobLikeJpaRepository.save(new JobLike(jobId, userId));
        } catch (DataIntegrityViolationException e) {
            // exists-체크와 save 사이의 경쟁 상태(빠른 중복 클릭 등)로 unique 제약이 걸린 경우 - 이미 좋아요 상태이므로 무시
        }
    }

    public void unlike(Long userId, Long jobId) {
        jobLikeJpaRepository.deleteByJobIdAndUserId(jobId, userId);
    }
}
