package org.example.caregiver.admin;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.example.caregiver.auth.AuthService;
import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.example.caregiver.auth.UserResponse;
import org.example.caregiver.job.Job;
import org.example.caregiver.job.JobApplicationRepository;
import org.example.caregiver.job.JobApplicationResponse;
import org.example.caregiver.job.JobRepository;
import org.example.caregiver.job.JobResponse;
import org.example.caregiver.job.JobService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// /api/**는 SecurityConfig에서 permitAll이라, 이 앱의 다른 컨트롤러들처럼 세션의 로그인 사용자를 직접 확인한다.
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobService jobService;
    private final JobApplicationRepository jobApplicationRepository;

    public AdminController(AuthService authService, UserRepository userRepository, JobRepository jobRepository,
                            JobService jobService, JobApplicationRepository jobApplicationRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.jobService = jobService;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats(HttpServletRequest httpRequest) {
        requireAdmin(httpRequest);
        long totalJobs = jobRepository.count();
        long closedJobs = jobRepository.countByClosedTrue();
        return Map.of(
                "totalUsers", userRepository.count(),
                "personalUsers", userRepository.countByUserType("personal"),
                "businessUsers", userRepository.countByUserType("business"),
                "totalJobs", totalJobs,
                "activeJobs", totalJobs - closedJobs,
                "closedJobs", closedJobs,
                "totalApplications", jobApplicationRepository.count()
        );
    }

    @GetMapping("/users")
    public List<UserResponse> getUsers(HttpServletRequest httpRequest) {
        requireAdmin(httpRequest);
        return userRepository.findAll().stream().map(UserResponse::new).toList();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, HttpServletRequest httpRequest) {
        requireAdmin(httpRequest);
        try {
            userRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이 회원이 등록한 공고나 지원 내역이 있어 삭제할 수 없습니다. 먼저 삭제해주세요.");
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/jobs")
    public List<JobResponse> getJobs(HttpServletRequest httpRequest) {
        requireAdmin(httpRequest);
        return jobService.getAllJobsForAdmin();
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, HttpServletRequest httpRequest) {
        requireAdmin(httpRequest);
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/applications")
    public List<JobApplicationResponse> getApplications(HttpServletRequest httpRequest) {
        requireAdmin(httpRequest);
        return jobApplicationRepository.findAllByOrderByIdDesc().stream()
                .map(app -> new JobApplicationResponse(app, app.getApplicant(), app.getJob()))
                .toList();
    }

    private void requireAdmin(HttpServletRequest httpRequest) {
        User user = authService.currentUser(httpRequest)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
        if (!"admin".equals(user.getUserType())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 접근할 수 있습니다.");
        }
    }
}
