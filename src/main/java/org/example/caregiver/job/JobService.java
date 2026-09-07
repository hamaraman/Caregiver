package org.example.caregiver.job;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJob(Long id) {
        return jobRepository.findById(id);
    }

    public Job createJob(JobCreateRequest request) {
        Job job = new Job(null, request.getTitle(), request.getBadge(), request.getBadgeColor(),
                request.getLocation(), request.getWage(), request.getHours(),
                request.getDays(), request.getDate(), false);
        return jobRepository.save(job);
    }
}
