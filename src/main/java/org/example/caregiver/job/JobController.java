package org.example.caregiver.job;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.example.caregiver.auth.AuthService;
import org.example.caregiver.auth.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final AuthService authService;

    public JobController(JobService jobService, AuthService authService) {
        this.jobService = jobService;
        this.authService = authService;
    }

    @GetMapping
    public List<JobResponse> getJobs(HttpServletRequest httpRequest) {
        Long viewerUserId = currentUserId(httpRequest);
        return jobService.getJobs(viewerUserId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJob(@PathVariable Long id, HttpServletRequest httpRequest) {
        Long viewerUserId = currentUserId(httpRequest);
        return jobService.getJob(id, viewerUserId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(@RequestBody JobCreateRequest request, HttpServletRequest httpRequest) {
        requireBusinessUser(httpRequest);
        JobResponse created = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<JobResponse> like(@PathVariable Long id, HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        return jobService.like(id, user.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<JobResponse> unlike(@PathVariable Long id, HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        return jobService.unlike(id, user.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @ExceptionHandler(JobException.class)
    public ResponseEntity<String> handleJobException(JobException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    private Long currentUserId(HttpServletRequest httpRequest) {
        return authService.currentUser(httpRequest).map(User::getId).orElse(null);
    }

    private User requireLoggedInUser(HttpServletRequest httpRequest) {
        return authService.currentUser(httpRequest)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
    }

    private User requireBusinessUser(HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        if (!"business".equals(user.getUserType())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사업자 계정만 공고를 등록할 수 있습니다.");
        }
        return user;
    }
}
