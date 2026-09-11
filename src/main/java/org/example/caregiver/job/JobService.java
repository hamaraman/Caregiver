package org.example.caregiver.job;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.example.caregiver.auth.User;
import org.example.caregiver.model.Region;
import org.example.caregiver.model.RegionQuery;
import org.example.caregiver.repository.RegionRepository;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobLikeRepository jobLikeRepository;
    private final RegionRepository regionRepository;

    public JobService(JobRepository jobRepository, JobLikeRepository jobLikeRepository, RegionRepository regionRepository) {
        this.jobRepository = jobRepository;
        this.jobLikeRepository = jobLikeRepository;
        this.regionRepository = regionRepository;
    }

    public List<JobResponse> getJobs(Long viewerUserId, String region) {
        String normalizedRegion = RegionQuery.normalize(region);
        List<Job> jobs = normalizedRegion == null
                ? jobRepository.findAllByOrderByIdDesc()
                : jobRepository.findByRegion_NameStartingWithOrderByIdDesc(normalizedRegion);
        return toResponses(jobs, viewerUserId);
    }

    public Optional<JobResponse> getJob(Long id, Long viewerUserId) {
        return jobRepository.findById(id)
                .map(job -> toResponse(job, viewerUserId));
    }

    public JobResponse createJob(JobCreateRequest request, User owner) {
        validate(request);
        Region region = getOrCreateRegion(request.getLocation().trim());
        Job job = new Job(null, request.getTitle(), request.getBadge(), request.getBadgeColor(),
                request.getLocation(), request.getWage(), request.getHours(),
                request.getDays(), request.getDate(), owner, request.getCompanyName(), request.getPostTitle(), region);
        applyDetails(job, request);
        Job saved = jobRepository.save(job);
        return toResponse(saved, owner != null ? owner.getId() : null);
    }

    private Region getOrCreateRegion(String name) {
        return regionRepository.findByName(name).orElseGet(() -> regionRepository.save(new Region(name)));
    }

    private void applyDetails(Job job, JobCreateRequest request) {
        job.setJobType(request.getJobType());
        job.setFacility(request.getFacility());
        job.setWorkForm(request.getWorkForm());
        job.setEmployForm(request.getEmployForm());
        job.setEducation(request.getEducation());
        job.setExperience(request.getExperience());
        job.setDeadline(request.getDeadline());
        job.setDaysNegotiable(request.getDaysNegotiable());
        job.setWeekdays(request.getWeekdays());
        job.setCareGender(request.getCareGender());
        job.setCareAge(request.getCareAge());
        job.setCareGrade(request.getCareGrade());
        job.setCareCondition(request.getCareCondition());
        job.setCareWork(request.getCareWork());
        job.setPostDetail(request.getPostDetail());
        job.setApplyMethod(request.getApplyMethod());
        job.setCompanyUrl(request.getCompanyUrl());
        job.setApplyEmail(request.getApplyEmail());
        job.setApplyFax(request.getApplyFax());
        job.setCompanyPhone(request.getCompanyPhone());
        job.setCompanyAddr(request.getCompanyAddr());
        job.setCompanyAddrDetail(request.getCompanyAddrDetail());
        job.setPhonePublic(request.getPhonePublic());
        job.setManagerName(request.getManagerName());
        job.setManagerPhone(request.getManagerPhone());
        job.setManagerEmail(request.getManagerEmail());
    }

    public List<JobResponse> getMyJobs(Long ownerId) {
        return toResponses(jobRepository.findByOwnerIdOrderByIdDesc(ownerId), ownerId);
    }

    private List<JobResponse> toResponses(List<Job> jobs, Long viewerUserId) {
        Set<Long> likedJobIds = jobLikeRepository.likedJobIds(viewerUserId, jobs.stream().map(Job::getId).toList());
        return jobs.stream()
                .map(job -> new JobResponse(job, likedJobIds.contains(job.getId())))
                .toList();
    }

    public Optional<JobResponse> like(Long jobId, Long userId) {
        return jobRepository.findById(jobId)
                .map(job -> {
                    jobLikeRepository.like(userId, jobId);
                    return toResponse(job, userId);
                });
    }

    public Optional<JobResponse> unlike(Long jobId, Long userId) {
        return jobRepository.findById(jobId)
                .map(job -> {
                    jobLikeRepository.unlike(userId, jobId);
                    return toResponse(job, userId);
                });
    }

    private JobResponse toResponse(Job job, Long viewerUserId) {
        return new JobResponse(job, jobLikeRepository.isLiked(viewerUserId, job.getId()));
    }

    private void validate(JobCreateRequest request) {
        if (isBlank(request.getTitle()) || isBlank(request.getLocation()) || isBlank(request.getWage())
                || isBlank(request.getHours()) || isBlank(request.getDays()) || isBlank(request.getDate())) {
            throw new JobException("제목, 지역, 급여, 근무시간, 근무요일, 등록일을 모두 입력해주세요.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
