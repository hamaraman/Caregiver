package org.example.caregiver.job;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class JobRepository {

    private final Map<Long, Job> jobs = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong();

    public JobRepository() {
        seed();
    }

    public List<Job> findAll() {
        return jobs.values().stream()
                .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
                .toList();
    }

    public Optional<Job> findById(Long id) {
        return Optional.ofNullable(jobs.get(id));
    }

    public Job save(Job job) {
        if (job.getId() == null) {
            job.setId(sequence.incrementAndGet());
        }
        jobs.put(job.getId(), job);
        return job;
    }

    private void seed() {
        save(new Job(null, "요양보호사 (주간)", "급구", "red", "서울 강남구",
                "시급 14,000원", "09:00~15:00", "주 5일", "09.06"));
        save(new Job(null, "요양보호사 (야간)", null, null, "경기 성남시",
                "시급 13,500원", "16:00~22:00", "주 5일", "09.05"));
        save(new Job(null, "요양보호사 (오후)", null, null, "인천 남동구",
                "시급 13,000원", "13:00~18:00", "주 5일", "09.05"));
    }
}
