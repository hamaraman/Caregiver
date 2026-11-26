package org.example.caregiver.job;

import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * wage_type / wage_amount / posted_on / applied_on 컬럼이 생기기 전에 저장된 행을 문자열 값에서 채운다.
 * 이미 채워진 행은 건너뛰므로 매번 실행돼도 안전하다.
 * ponytail: 전체 테이블을 읽는다. 데이터가 커지거나 Flyway를 도입하면 SQL 마이그레이션으로 옮기고 이 클래스는 삭제
 */
@Component
public class LegacyColumnBackfill implements CommandLineRunner {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public LegacyColumnBackfill(JobRepository jobRepository, JobApplicationRepository jobApplicationRepository) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        LocalDate today = LocalDate.now();
        for (Job job : jobRepository.findAll()) {
            if (job.getPostedOn() == null) job.setPostedOn(Job.fromMonthDay(job.getDate(), today));
            if (job.getWageAmount() == null && job.getWage() != null) job.setWage(job.getWage());
        }
        for (JobApplication app : jobApplicationRepository.findAll()) {
            if (app.getAppliedOn() == null) app.setAppliedOn(Job.fromMonthDay(app.getAppliedAt(), today));
        }
    }
}
