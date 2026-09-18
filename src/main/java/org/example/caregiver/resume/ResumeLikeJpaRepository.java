package org.example.caregiver.resume;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
interface ResumeLikeJpaRepository extends JpaRepository<ResumeLike, Long> {

    boolean existsByResumeIdAndUserId(Long resumeId, Long userId);

    List<ResumeLike> findByUserIdOrderByIdDesc(Long userId);

    @Modifying
    @Transactional
    void deleteByResumeIdAndUserId(Long resumeId, Long userId);
}
