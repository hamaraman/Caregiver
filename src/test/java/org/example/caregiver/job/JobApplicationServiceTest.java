package org.example.caregiver.job;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;

class JobApplicationServiceTest {

    private final JobApplicationRepository applications = mock(JobApplicationRepository.class);
    private final JobRepository jobs = mock(JobRepository.class);
    private final UserRepository users = mock(UserRepository.class);
    private final JobApplicationService service = new JobApplicationService(applications, jobs, users);

    private final User owner = user(1L, "business");
    private final User seeker = user(2L, "personal");
    private Job job;

    @BeforeEach
    void setUp() {
        job = new Job();
        job.setId(10L);
        job.setOwner(owner);
        when(jobs.findById(10L)).thenReturn(Optional.of(job));
        when(users.getReferenceById(2L)).thenReturn(seeker);
        when(applications.save(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void applySavesReviewingApplication() {
        JobApplicationResponse res = service.apply(10L, 2L);
        assertEquals("검토중", res.getStatus());
    }

    @Test
    void applyRejectsClosedJob() {
        job.setClosed(true);
        assertThrows(JobApplicationException.class, () -> service.apply(10L, 2L));
        verify(applications, never()).save(any());
    }

    @Test
    void applyRejectsDuplicate() {
        when(applications.existsByJobIdAndApplicantId(10L, 2L)).thenReturn(true);
        assertThrows(JobApplicationException.class, () -> service.apply(10L, 2L));
        verify(applications, never()).save(any());
    }

    @Test
    void applyTurnsUniqueConstraintRaceIntoDuplicateError() {
        when(applications.save(any())).thenThrow(new DataIntegrityViolationException("dup"));
        JobApplicationException e = assertThrows(JobApplicationException.class, () -> service.apply(10L, 2L));
        assertEquals("이미 지원한 공고입니다.", e.getMessage());
    }

    @Test
    void onlyOwnerCanSeeApplicants() {
        assertThrows(JobApplicationException.class, () -> service.getApplicantsForJob(10L, 2L));
    }

    @Test
    void ownerCanChangeStatus() {
        JobApplication app = new JobApplication(job, seeker, "검토중", "09.06");
        when(applications.findById(5L)).thenReturn(Optional.of(app));

        service.updateStatus(5L, 1L, "합격");

        assertEquals("합격", app.getStatus());
    }

    @Test
    void nonOwnerCannotChangeStatus() {
        JobApplication app = new JobApplication(job, seeker, "검토중", "09.06");
        when(applications.findById(5L)).thenReturn(Optional.of(app));

        assertThrows(JobApplicationException.class, () -> service.updateStatus(5L, 2L, "합격"));
        assertEquals("검토중", app.getStatus());
    }

    @Test
    void rejectsUnknownStatus() {
        assertThrows(JobApplicationException.class, () -> service.updateStatus(5L, 1L, "보류"));
    }

    private static User user(Long id, String type) {
        return new User(id, "u" + id + "@example.com", "hash", "이름" + id, type);
    }
}
