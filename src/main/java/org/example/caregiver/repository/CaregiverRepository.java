package org.example.caregiver.repository;

import java.util.List;
import org.example.caregiver.model.Caregiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaregiverRepository extends JpaRepository<Caregiver, Long> {

    List<Caregiver> findAllByOrderByIdDesc();

    List<Caregiver> findByRegion_NameStartingWithOrderByIdDesc(String region);
}
