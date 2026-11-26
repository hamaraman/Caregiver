package org.example.caregiver.job;

import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByJobIdOrderByIdDesc(Long jobId);

    List<JobApplication> findByApplicantIdOrderByIdDesc(Long applicantId);

    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    boolean existsByApplicantIdAndJobIdIn(Long applicantId, List<Long> jobIds);

    @EntityGraph(attributePaths = {"job", "applicant"})
    List<JobApplication> findAllByOrderByIdDesc();

    void deleteByJobId(Long jobId);
}
