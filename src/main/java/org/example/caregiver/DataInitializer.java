package org.example.caregiver;

import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.example.caregiver.job.Job;
import org.example.caregiver.job.JobRepository;
import org.example.caregiver.model.Caregiver;
import org.example.caregiver.model.Region;
import org.example.caregiver.repository.CaregiverRepository;
import org.example.caregiver.repository.RegionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RegionRepository regionRepository;
    private final UserRepository userRepository;
    private final CaregiverRepository caregiverRepository;
    private final JobRepository jobRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(RegionRepository regionRepository, UserRepository userRepository,
                            CaregiverRepository caregiverRepository, JobRepository jobRepository) {
        this.regionRepository = regionRepository;
        this.userRepository = userRepository;
        this.caregiverRepository = caregiverRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Region seoul = getOrCreateRegion("서울 강남구");
        Region gyeonggi = getOrCreateRegion("경기 성남시");
        Region incheon = getOrCreateRegion("인천 남동구");

        if (caregiverRepository.count() == 0) {
            User owner1 = getOrCreateBusinessUser("hong@example.com", "김보호");
            User owner2 = getOrCreateBusinessUser("lee@example.com", "이요양");

            caregiverRepository.save(new Caregiver("김영희", "치매 전문", 5, 4.8, owner1, seoul));
            caregiverRepository.save(new Caregiver("이철수", "거동 불편 보조", 3, 4.5, owner2, gyeonggi));
            caregiverRepository.save(new Caregiver("박지민", "일상 생활 지원", 7, 4.9, owner1, incheon));
        }

        if (jobRepository.count() == 0) {
            jobRepository.save(new Job(null, "요양보호사 (주간)", "급구", "red", "서울 강남구",
                    "시급 14,000원", "09:00~15:00", "주 5일", "09.06", seoul));
            jobRepository.save(new Job(null, "요양보호사 (야간)", null, null, "경기 성남시",
                    "시급 13,500원", "16:00~22:00", "주 5일", "09.05", gyeonggi));
            jobRepository.save(new Job(null, "요양보호사 (오후)", null, null, "인천 남동구",
                    "시급 13,000원", "13:00~18:00", "주 5일", "09.05", incheon));
        }
    }

    private Region getOrCreateRegion(String name) {
        return regionRepository.findByName(name).orElseGet(() -> regionRepository.save(new Region(name)));
    }

    private User getOrCreateBusinessUser(String email, String name) {
        return userRepository.findByEmail(email).orElseGet(() ->
                userRepository.save(new User(null, email, passwordEncoder.encode("password123"), name, "business")));
    }
}
