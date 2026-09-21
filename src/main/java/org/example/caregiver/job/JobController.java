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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public List<JobResponse> getJobs(@RequestParam(required = false) String region, HttpServletRequest httpRequest) {
        Long viewerUserId = currentUserId(httpRequest);
        return jobService.getJobs(viewerUserId, region);
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
        User owner = requireBusinessUser(httpRequest);
        JobResponse created = jobService.createJob(request, owner);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/mine")
    public List<JobResponse> getMyJobs(HttpServletRequest httpRequest) {
        User owner = requireBusinessUser(httpRequest);
        return jobService.getMyJobs(owner.getId());
    }

    @GetMapping("/liked")
    public List<JobResponse> getLikedJobs(HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        return jobService.getLikedJobs(user.getId());
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<JobResponse> like(@PathVariable Long id, HttpServletRequest httpRequest) {
        User user = requirePersonalUser(httpRequest);
        return jobService.like(id, user.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<JobResponse> unlike(@PathVariable Long id, HttpServletRequest httpRequest) {
        User user = requirePersonalUser(httpRequest);
        return jobService.unlike(id, user.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<JobResponse> close(@PathVariable Long id, HttpServletRequest httpRequest) {
        User owner = requireLoggedInUser(httpRequest);
        return ResponseEntity.ok(jobService.closeJob(id, owner.getId()));
    }

    @PatchMapping("/{id}/reopen")
    public ResponseEntity<JobResponse> reopen(@PathVariable Long id, HttpServletRequest httpRequest) {
        User owner = requireLoggedInUser(httpRequest);
        return ResponseEntity.ok(jobService.reopenJob(id, owner.getId()));
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

    // 일자리 찜하기는 구직자(개인 회원) 전용 기능 - 프론트에서 버튼을 숨기는 것만으로는 API 직접 호출을 막을 수 없어 서버에서도 검사한다.
    private User requirePersonalUser(HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        if ("business".equals(user.getUserType())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "개인 회원 계정만 일자리를 찜할 수 있습니다.");
        }
        return user;
    }
}
