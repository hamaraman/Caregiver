package org.example.caregiver.job;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class JobApplicationService {

    private static final DateTimeFormatter APPLIED_AT_FORMAT = DateTimeFormatter.ofPattern("MM.dd");
    private static final List<String> ALLOWED_STATUSES = List.of("검토중", "합격", "불합격");

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository, JobRepository jobRepository,
                                  UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public JobApplicationResponse apply(Long jobId, Long applicantId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobApplicationException("존재하지 않는 공고입니다."));
        if (jobApplicationRepository.existsByJobIdAndApplicantId(jobId, applicantId)) {
            throw new JobApplicationException("이미 지원한 공고입니다.");
        }
        JobApplication application = jobApplicationRepository.save(
                new JobApplication(job.getId(), applicantId, "검토중", LocalDate.now().format(APPLIED_AT_FORMAT)));
        return toResponse(application);
    }

    public List<JobApplicationResponse> getApplicantsForJob(Long jobId, Long requesterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobApplicationException("존재하지 않는 공고입니다."));
        requireOwner(job, requesterId);
        return jobApplicationRepository.findByJobIdOrderByIdDesc(jobId).stream()
                .map(this::toResponse)
                .toList();
    }

    public JobApplicationResponse updateStatus(Long applicationId, Long requesterId, String status) {
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new JobApplicationException("상태 값이 올바르지 않습니다.");
        }
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new JobApplicationException("존재하지 않는 지원 내역입니다."));
        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new JobApplicationException("존재하지 않는 공고입니다."));
        requireOwner(job, requesterId);
        application.setStatus(status);
        jobApplicationRepository.save(application);
        return toResponse(application);
    }

    private void requireOwner(Job job, Long requesterId) {
        if (job.getOwner() == null || !job.getOwner().getId().equals(requesterId)) {
            throw new JobApplicationException("본인이 등록한 공고만 조회/수정할 수 있습니다.");
        }
    }

    private JobApplicationResponse toResponse(JobApplication application) {
        User applicant = userRepository.findById(application.getApplicantId()).orElse(null);
        return new JobApplicationResponse(application, applicant);
    }
}
