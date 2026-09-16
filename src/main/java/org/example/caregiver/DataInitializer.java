package org.example.caregiver;

import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.example.caregiver.job.Job;
import org.example.caregiver.job.JobRepository;
import java.util.List;
import org.example.caregiver.model.Caregiver;
import org.example.caregiver.model.CaregiverWorkHistory;
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

        User owner1 = getOrCreateBusinessUser("hong@example.com", "김보호");
        User owner2 = getOrCreateBusinessUser("lee@example.com", "이요양");

        if (caregiverRepository.count() == 0) {
            Caregiver younghee = new Caregiver("김영희", "치매 전문", 5, 4.8, "010-1111-2222", owner1, seoul);
            younghee.setGender("여");
            younghee.setAge(52);
            younghee.setJobType("요양보호사");
            younghee.setEducation("고졸");
            younghee.setWorkType("출·퇴근형");
            younghee.setWageType("시급");
            younghee.setWageAmount(14000L);
            younghee.setWishRegion("서울 강남구, 서초구");
            younghee.setWishHours("09:00~15:00");
            younghee.setIntro("5년간 재가요양 경험이 있으며 치매 어르신 돌봄에 익숙합니다. 성실하고 꼼꼼하게 업무를 수행하겠습니다.");
            younghee.setStatus("구직중");
            younghee.setDate("09.06");
            younghee.setCerts(List.of("요양보호사 1급"));
            younghee.setWishDays(List.of("월", "화", "수", "목", "금"));
            younghee.setWorkHistory(List.of(new CaregiverWorkHistory("강남재가복지센터", "2019.03 ~ 2024.02", "방문요양보호사")));
            caregiverRepository.save(younghee);

            Caregiver chulsoo = new Caregiver("이철수", "거동 불편 보조", 3, 4.5, "010-2222-3333", owner2, gyeonggi);
            chulsoo.setGender("남");
            chulsoo.setAge(41);
            chulsoo.setJobType("간병인");
            chulsoo.setEducation("고졸");
            chulsoo.setWorkType("입주형");
            chulsoo.setWageType("월급");
            chulsoo.setWageAmount(4500000L);
            chulsoo.setWishRegion("경기 성남시, 용인시");
            chulsoo.setWishHours("협의 가능");
            chulsoo.setIntro("거동이 불편하신 어르신 이동 보조와 일상 지원 경험이 풍부합니다. 입주 근무 가능합니다.");
            chulsoo.setStatus("구직중");
            chulsoo.setDate("09.05");
            chulsoo.setCerts(List.of("요양보호사 1급"));
            chulsoo.setWishDays(List.of("월", "화", "수", "목", "금", "토", "일"));
            chulsoo.setWorkHistory(List.of(new CaregiverWorkHistory("분당복지재단", "2021.06 ~ 2024.05", "재가요양보호사")));
            caregiverRepository.save(chulsoo);

            Caregiver jimin = new Caregiver("박지민", "일상 생활 지원", 7, 4.9, "010-3333-4444", owner1, incheon);
            jimin.setGender("여");
            jimin.setAge(48);
            jimin.setJobType("요양보호사");
            jimin.setEducation("대졸");
            jimin.setWorkType("출·퇴근형");
            jimin.setWageType("시급");
            jimin.setWageAmount(13500L);
            jimin.setWishRegion("인천 남동구, 연수구");
            jimin.setWishHours("09:00~17:00");
            jimin.setIntro("사회복지사 자격도 보유하고 있으며 다양한 케어 경험을 쌓았습니다. 어르신들과 친밀하게 소통하는 것을 즐깁니다.");
            jimin.setStatus("구직중");
            jimin.setDate("09.05");
            jimin.setCerts(List.of("요양보호사 1급", "사회복지사 2급"));
            jimin.setWishDays(List.of("월", "화", "수", "목", "금"));
            jimin.setWorkHistory(List.of(new CaregiverWorkHistory("인천성모병원", "2017.01 ~ 2022.12", "병원 간병인")));
            caregiverRepository.save(jimin);
        }

        if (jobRepository.count() == 0) {
            jobRepository.save(new Job(null, "요양보호사 (주간)", "급구", "red", "서울 강남구",
                    "시급 14,000원", "09:00~15:00", "주 5일", "09.06",
                    owner1, "강남재가복지센터", "강남구 요양보호사 급구 (주간)", seoul));
            jobRepository.save(new Job(null, "요양보호사 (야간)", null, null, "경기 성남시",
                    "시급 13,500원", "16:00~22:00", "주 5일", "09.05",
                    owner2, "분당복지재단", "성남시 요양보호사 모집 (야간)", gyeonggi));
            jobRepository.save(new Job(null, "요양보호사 (오후)", null, null, "인천 남동구",
                    "시급 13,000원", "13:00~18:00", "주 5일", "09.05",
                    owner1, "강남재가복지센터", "인천 남동구 요양보호사 모집 (오후)", incheon));
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
