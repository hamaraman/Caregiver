package org.example.caregiver.job;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<Job> getJobs() {
        return jobService.getJobs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        return jobService.getJob(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody JobCreateRequest request) {
        Job created = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
