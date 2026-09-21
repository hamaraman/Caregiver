package org.example.caregiver.support;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryJpaRepository extends JpaRepository<Inquiry, Long> {

    List<Inquiry> findAllByOrderByIdDesc();
}
