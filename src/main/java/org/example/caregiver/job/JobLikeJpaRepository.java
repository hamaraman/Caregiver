package org.example.caregiver.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
interface JobLikeJpaRepository extends JpaRepository<JobLike, Long> {

    boolean existsByJobIdAndUserId(Long jobId, Long userId);

    @Modifying
    @Transactional
    void deleteByJobIdAndUserId(Long jobId, Long userId);
}
