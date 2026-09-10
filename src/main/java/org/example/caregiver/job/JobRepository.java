package org.example.caregiver.job;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findAllByOrderByIdDesc();

    List<Job> findByOwnerIdOrderByIdDesc(Long ownerId);

    List<Job> findByRegion_NameStartingWithOrderByIdDesc(String region);
}
