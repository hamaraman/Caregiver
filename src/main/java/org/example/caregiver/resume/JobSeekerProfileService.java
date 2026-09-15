package org.example.caregiver.resume;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import org.example.caregiver.auth.User;
import org.example.caregiver.job.Job;
import org.example.caregiver.job.JobApplicationRepository;
import org.example.caregiver.job.JobRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class JobSeekerProfileService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("MM.dd");

    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public JobSeekerProfileService(JobSeekerProfileRepository jobSeekerProfileRepository,
                                    JobRepository jobRepository,
                                    JobApplicationRepository jobApplicationRepository) {
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public JobSeekerProfileResponse upsert(Long userId, JobSeekerProfileRequest request) {
        validate(request);
        try {
            return doUpsert(userId, request);
        } catch (DataIntegrityViolationException e) {
            // find-then-save 사이의 경쟁 상태(동시 저장 요청)로 unique 제약이 걸린 경우 - 이제는 생성되어 있으니 업데이트로 재시도
            return doUpsert(userId, request);
        }
    }

    private JobSeekerProfileResponse doUpsert(Long userId, JobSeekerProfileRequest request) {
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(userId)
                .orElseGet(() -> new JobSeekerProfile(userId, null, null, null, null, null,
                        null, null, null, false, null, null));
        if (profile.getId() == null) {
            profile.setDate(LocalDate.now().format(DATE_FORMAT));
        }
        profile.setName(request.getName());
        profile.setPhone(request.getPhone());
        profile.setBirth(request.getBirth());
        profile.setGender(request.getGender());
        profile.setRegion(request.getRegion());
        profile.setWorkRegion(request.getWorkRegion());
        profile.setWorkTypes(request.getWorkTypes());
        profile.setSalary(request.getSalary());
        profile.setCert(request.getCert());
        profile.setNew(request.isNew());
        profile.setExpPeriod(request.getExpPeriod());
        profile.setIntro(request.getIntro());
        JobSeekerProfile saved = jobSeekerProfileRepository.save(profile);
        return new JobSeekerProfileResponse(saved);
    }

    public Optional<JobSeekerProfileResponse> getMine(Long userId) {
        return jobSeekerProfileRepository.findByUserId(userId).map(JobSeekerProfileResponse::new);
    }

    public List<JobSeekerProfileResponse> getAll() {
        return jobSeekerProfileRepository.findAllByOrderByIdDesc().stream()
                .map(JobSeekerProfileResponse::new)
                .toList();
    }

    public Optional<JobSeekerProfileResponse> getPublicProfile(Long id) {
        return jobSeekerProfileRepository.findById(id).map(JobSeekerProfileResponse::new);
    }

    public boolean canViewAsEmployer(Long applicantId, User requester) {
        if (!"business".equals(requester.getUserType())) {
            return false;
        }
        List<Long> jobIds = jobRepository.findByOwnerIdOrderByIdDesc(requester.getId())
                .stream().map(Job::getId).toList();
        return !jobIds.isEmpty() && jobApplicationRepository.existsByApplicantIdAndJobIdIn(applicantId, jobIds);
    }

    private void validate(JobSeekerProfileRequest request) {
        if (isBlank(request.getName()) || isBlank(request.getPhone())) {
            throw new ResumeException("이름과 연락처를 입력해주세요.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
