package org.example.caregiver.resume;

import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Repository;

@Repository
public class ResumeLikeRepository {

    private final ResumeLikeJpaRepository jpa;

    public ResumeLikeRepository(ResumeLikeJpaRepository jpa) {
        this.jpa = jpa;
    }

    public void like(Long userId, Long resumeId) {
        if (jpa.existsByResumeIdAndUserId(resumeId, userId)) return;
        try {
            jpa.save(new ResumeLike(resumeId, userId));
        } catch (DataIntegrityViolationException e) {
            // 이미 찜한 상태 - 무시
        }
    }

    public void unlike(Long userId, Long resumeId) {
        jpa.deleteByResumeIdAndUserId(resumeId, userId);
    }

    public List<Long> likedResumeIdsForUser(Long userId) {
        return jpa.findByUserIdOrderByIdDesc(userId).stream()
                .map(ResumeLike::getResumeId)
                .toList();
    }
}
