package org.example.caregiver;

import org.example.caregiver.model.Caregiver;
import org.example.caregiver.model.Job;
import org.example.caregiver.model.Member;
import org.example.caregiver.model.Region;
import org.example.caregiver.repository.CaregiverRepository;
import org.example.caregiver.repository.JobRepository;
import org.example.caregiver.repository.MemberRepository;
import org.example.caregiver.repository.RegionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RegionRepository regionRepository;
    private final MemberRepository memberRepository;
    private final JobRepository jobRepository;
    private final CaregiverRepository caregiverRepository;

    public DataInitializer(RegionRepository regionRepository, MemberRepository memberRepository, JobRepository jobRepository, CaregiverRepository caregiverRepository) {
        this.regionRepository = regionRepository;
        this.memberRepository = memberRepository;
        this.jobRepository = jobRepository;
        this.caregiverRepository = caregiverRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (regionRepository.count() == 0) {
            Region seoul = regionRepository.save(new Region("서울 강남구"));
            Region gyeonggi = regionRepository.save(new Region("경기 성남시"));
            Region incheon = regionRepository.save(new Region("인천 남동구"));

            Member member1 = memberRepository.save(new Member("user1", "pass", "김보호", seoul));
            Member member2 = memberRepository.save(new Member("user2", "pass", "이요양", gyeonggi));

            // Jobs
            jobRepository.save(new Job("요양보호사 (주간)", "급구", "red", "서울 강남구", "시급 14,000원", "09:00~15:00", "주 5일", "09.06", false, member1, seoul));
            jobRepository.save(new Job("요양보호사 (야간)", null, null, "경기 성남시", "시급 13,500원", "16:00~22:00", "주 5일", "09.05", false, member2, gyeonggi));
            jobRepository.save(new Job("요양보호사 (오후)", null, null, "인천 남동구", "시급 13,000원", "13:00~18:00", "주 5일", "09.05", false, member1, incheon));

            // Caregivers
            caregiverRepository.save(new Caregiver("김영희", "치매 전문", 5, 4.8, member1, seoul));
            caregiverRepository.save(new Caregiver("이철수", "거동 불편 보조", 3, 4.5, member2, gyeonggi));
            caregiverRepository.save(new Caregiver("박지민", "일상 생활 지원", 7, 4.9, member1, incheon));
        }
    }
}
