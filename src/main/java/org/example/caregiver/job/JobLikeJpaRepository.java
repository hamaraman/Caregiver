package org.example.caregiver.job;

import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
interface JobLikeJpaRepository extends JpaRepository<JobLike, Long> {

    boolean existsByJobIdAndUserId(Long jobId, Long userId);

    List<JobLike> findByUserIdAndJobIdIn(Long userId, Collection<Long> jobIds);

    @Query("select new org.example.caregiver.job.JobLikeCount(l.jobId, count(l)) "
            + "from JobLike l where l.jobId in :jobIds group by l.jobId")
    List<JobLikeCount> countGroupedByJobIds(@Param("jobIds") Collection<Long> jobIds);

    @Modifying
    @Transactional
    void deleteByJobIdAndUserId(Long jobId, Long userId);
}
