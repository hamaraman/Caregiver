package org.example.caregiver.job;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.example.caregiver.auth.AuthService;
import org.example.caregiver.auth.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;
    private final AuthService authService;

    public JobApplicationController(JobApplicationService jobApplicationService, AuthService authService) {
        this.jobApplicationService = jobApplicationService;
        this.authService = authService;
    }

    @PostMapping("/jobs/{jobId}/applications")
    public ResponseEntity<JobApplicationResponse> apply(@PathVariable Long jobId, HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        JobApplicationResponse response = jobApplicationService.apply(jobId, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/jobs/{jobId}/applications")
    public List<JobApplicationResponse> getApplicants(@PathVariable Long jobId, HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        return jobApplicationService.getApplicantsForJob(jobId, user.getId());
    }

    @PatchMapping("/applications/{id}/status")
    public JobApplicationResponse updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request,
                                                HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        return jobApplicationService.updateStatus(id, user.getId(), request.getStatus());
    }

    @ExceptionHandler(JobApplicationException.class)
    public ResponseEntity<String> handleJobApplicationException(JobApplicationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    private User requireLoggedInUser(HttpServletRequest httpRequest) {
        return authService.currentUser(httpRequest)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
    }
}
