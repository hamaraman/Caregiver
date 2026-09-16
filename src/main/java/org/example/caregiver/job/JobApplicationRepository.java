package org.example.caregiver.job;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByJobIdOrderByIdDesc(Long jobId);

    List<JobApplication> findByApplicantIdOrderByIdDesc(Long applicantId);

    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    boolean existsByApplicantIdAndJobIdIn(Long applicantId, List<Long> jobIds);
}
