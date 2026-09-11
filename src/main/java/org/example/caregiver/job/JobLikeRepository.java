package org.example.caregiver.job;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
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

    /** 목록 조회 시 공고마다 찜 여부를 따로 쿼리하지 않도록 한 번에 조회한다. */
    public Set<Long> likedJobIds(Long userId, Collection<Long> jobIds) {
        if (userId == null || jobIds.isEmpty()) {
            return Set.of();
        }
        return jobLikeJpaRepository.findByUserIdAndJobIdIn(userId, jobIds).stream()
                .map(JobLike::getJobId)
                .collect(Collectors.toSet());
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
