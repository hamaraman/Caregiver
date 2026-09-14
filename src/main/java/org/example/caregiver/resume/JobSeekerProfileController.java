package org.example.caregiver.resume;

import jakarta.servlet.http.HttpServletRequest;
import org.example.caregiver.auth.AuthService;
import org.example.caregiver.auth.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/resumes")
public class JobSeekerProfileController {

    private final JobSeekerProfileService jobSeekerProfileService;
    private final AuthService authService;

    public JobSeekerProfileController(JobSeekerProfileService jobSeekerProfileService, AuthService authService) {
        this.jobSeekerProfileService = jobSeekerProfileService;
        this.authService = authService;
    }

    @PostMapping("/me")
    public JobSeekerProfileResponse upsert(@RequestBody JobSeekerProfileRequest request, HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        return jobSeekerProfileService.upsert(user.getId(), request);
    }

    @GetMapping("/me")
    public ResponseEntity<JobSeekerProfileResponse> getMine(HttpServletRequest httpRequest) {
        User user = requireLoggedInUser(httpRequest);
        return jobSeekerProfileService.getMine(user.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<JobSeekerProfileResponse> getByUserId(@PathVariable Long userId, HttpServletRequest httpRequest) {
        User requester = requireLoggedInUser(httpRequest);
        requireCanView(requester, userId);
        return jobSeekerProfileService.getMine(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @ExceptionHandler(ResumeException.class)
    public ResponseEntity<String> handleResumeException(ResumeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    private User requireLoggedInUser(HttpServletRequest httpRequest) {
        return authService.currentUser(httpRequest)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
    }

    private void requireCanView(User requester, Long targetUserId) {
        if (requester.getId().equals(targetUserId)) {
            return;
        }
        if (!jobSeekerProfileService.canViewAsEmployer(targetUserId, requester)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 지원자의 이력서를 조회할 권한이 없습니다.");
        }
    }
}
