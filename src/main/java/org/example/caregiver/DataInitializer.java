package org.example.caregiver;

import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.example.caregiver.job.Job;
import org.example.caregiver.job.JobRepository;
import org.example.caregiver.model.Region;
import org.example.caregiver.repository.RegionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RegionRepository regionRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(RegionRepository regionRepository, UserRepository userRepository,
                            JobRepository jobRepository) {
        this.regionRepository = regionRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Region seoul = getOrCreateRegion("서울 강남구");
        Region gyeonggi = getOrCreateRegion("경기 성남시");
        Region incheon = getOrCreateRegion("인천 남동구");

        User owner1 = getOrCreateBusinessUser("hong@example.com", "김보호");
        User owner2 = getOrCreateBusinessUser("lee@example.com", "이요양");

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

        if (jobRepository.count() > 0 && jobRepository.count() < 10) {
            Region songpa   = getOrCreateRegion("서울 송파구");
            Region nowon    = getOrCreateRegion("서울 노원구");
            Region gangseo  = getOrCreateRegion("서울 강서구");
            Region mapo     = getOrCreateRegion("서울 마포구");
            Region seocho   = getOrCreateRegion("서울 서초구");
            Region gangbuk  = getOrCreateRegion("서울 강북구");
            Region dongjak  = getOrCreateRegion("서울 동작구");
            Region jungnang = getOrCreateRegion("서울 중랑구");
            Region eunpyeong= getOrCreateRegion("서울 은평구");
            Region suwon    = getOrCreateRegion("경기 수원시");
            Region goyang   = getOrCreateRegion("경기 고양시");
            Region yongin   = getOrCreateRegion("경기 용인시");
            Region bucheon  = getOrCreateRegion("경기 부천시");
            Region ansan    = getOrCreateRegion("경기 안산시");
            Region hwaseong = getOrCreateRegion("경기 화성시");
            Region namyangju= getOrCreateRegion("경기 남양주시");
            Region pyeongtaek= getOrCreateRegion("경기 평택시");
            Region paju     = getOrCreateRegion("경기 파주시");
            Region siheung  = getOrCreateRegion("경기 시흥시");
            Region gwangju  = getOrCreateRegion("경기 광주시");
            Region uijeongbu= getOrCreateRegion("경기 의정부시");
            Region incheonSeo= getOrCreateRegion("인천 서구");
            Region incheonYeonsu= getOrCreateRegion("인천 연수구");
            Region incheonBupyeong= getOrCreateRegion("인천 부평구");
            Region busanHaeundae= getOrCreateRegion("부산 해운대구");
            Region busanSuyeong= getOrCreateRegion("부산 수영구");
            Region daeguDalseo= getOrCreateRegion("대구 달서구");
            Region daejeonSeo= getOrCreateRegion("대전 서구");
            Region gwangjuBuk= getOrCreateRegion("광주 북구");
            Region ulsanNam = getOrCreateRegion("울산 남구");

            User owner3 = getOrCreateBusinessUser("park@example.com", "박센터장");
            User owner4 = getOrCreateBusinessUser("choi@example.com", "최원장");
            User owner5 = getOrCreateBusinessUser("kim@example.com", "김대표");

            jobRepository.save(new Job(null, "요양보호사 (주간)", "급구", "red", "서울 송파구",
                    "시급 14,500원", "09:00~15:00", "주 5일", "09.15", owner3, "송파노인복지센터", "송파구 요양보호사 급구 (주간)", songpa));
            jobRepository.save(new Job(null, "요양보호사 (오전)", null, null, "서울 노원구",
                    "시급 13,800원", "08:00~13:00", "주 5일", "09.14", owner4, "노원케어서비스", "노원구 요양보호사 모집 (오전)", nowon));
            jobRepository.save(new Job(null, "간병인 (24시간)", "급구", "red", "서울 은평구",
                    "일급 120,000원", "24시간", "주 7일", "09.14", owner1, "은평요양원", "은평구 입주 간병인 급구", eunpyeong));
            jobRepository.save(new Job(null, "요양보호사 (주간)", "신규", "blue", "경기 수원시",
                    "시급 14,000원", "09:00~15:00", "주 5일", "09.13", owner5, "수원재가복지센터", "수원시 요양보호사 신규 모집 (주간)", suwon));
            jobRepository.save(new Job(null, "요양보호사 (야간)", null, null, "경기 고양시",
                    "시급 14,500원", "22:00~06:00", "주 5일", "09.13", owner3, "고양시니어케어", "고양시 요양보호사 모집 (야간)", goyang));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "경기 용인시",
                    "시급 13,500원", "09:00~16:00", "주 5일", "09.12", owner4, "용인복지재단", "용인시 요양보호사 모집 (주간)", yongin));
            jobRepository.save(new Job(null, "간병인 (주간)", "급구", "red", "경기 부천시",
                    "시급 13,000원", "09:00~18:00", "주 5일", "09.12", owner2, "부천요양원", "부천시 간병인 급구", bucheon));
            jobRepository.save(new Job(null, "요양보호사 (오후)", null, null, "경기 안산시",
                    "시급 13,500원", "13:00~18:00", "주 5일", "09.11", owner5, "안산재가요양센터", "안산시 요양보호사 모집 (오후)", ansan));
            jobRepository.save(new Job(null, "요양보호사 (주간)", "신규", "blue", "인천 서구",
                    "시급 14,000원", "09:00~15:00", "주 5일", "09.11", owner1, "인천서구복지원", "인천 서구 요양보호사 신규 모집", incheonSeo));
            jobRepository.save(new Job(null, "요양보호사 (야간)", "급구", "red", "인천 연수구",
                    "시급 13,800원", "18:00~00:00", "주 5일", "09.11", owner3, "연수케어센터", "인천 연수구 요양보호사 급구 (야간)", incheonYeonsu));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "부산 해운대구",
                    "시급 13,500원", "09:00~15:00", "주 5일", "09.10", owner4, "해운대복지재단", "부산 해운대 요양보호사 모집 (주간)", busanHaeundae));
            jobRepository.save(new Job(null, "간병인 (주간)", null, null, "부산 수영구",
                    "시급 13,000원", "09:00~17:00", "주 5일", "09.10", owner5, "수영구노인복지관", "부산 수영구 간병인 모집", busanSuyeong));
            jobRepository.save(new Job(null, "요양보호사 (주간)", "급구", "red", "대구 달서구",
                    "시급 13,500원", "09:00~15:00", "주 5일", "09.10", owner2, "달서케어센터", "대구 달서구 요양보호사 급구 (주간)", daeguDalseo));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "대전 서구",
                    "시급 13,000원", "09:00~15:00", "주 5일", "09.09", owner1, "대전서구복지원", "대전 서구 요양보호사 모집 (주간)", daejeonSeo));
            jobRepository.save(new Job(null, "요양보호사 (오후)", "신규", "blue", "광주 북구",
                    "시급 13,000원", "13:00~18:00", "주 5일", "09.09", owner3, "광주북구노인케어", "광주 북구 요양보호사 신규 모집 (오후)", gwangjuBuk));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "울산 남구",
                    "시급 13,500원", "09:00~15:00", "주 5일", "09.09", owner4, "울산남구복지센터", "울산 남구 요양보호사 모집 (주간)", ulsanNam));
            jobRepository.save(new Job(null, "요양보호사 (야간)", "급구", "red", "서울 강서구",
                    "시급 15,000원", "22:00~06:00", "주 5일", "09.08", owner5, "강서야간케어", "서울 강서구 요양보호사 급구 (야간)", gangseo));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "서울 마포구",
                    "시급 14,200원", "09:00~15:00", "주 5일", "09.08", owner2, "마포복지재단", "서울 마포구 요양보호사 모집 (주간)", mapo));
            jobRepository.save(new Job(null, "간병인 (입주)", null, null, "서울 서초구",
                    "월급 3,500,000원", "협의", "주 7일", "09.08", owner1, "서초시니어케어", "서울 서초구 입주 간병인 모집", seocho));
            jobRepository.save(new Job(null, "요양보호사 (주간)", "신규", "blue", "경기 화성시",
                    "시급 13,800원", "09:00~15:00", "주 5일", "09.07", owner3, "화성재가복지센터", "경기 화성시 요양보호사 신규 모집", hwaseong));
            jobRepository.save(new Job(null, "요양보호사 (오전)", null, null, "경기 남양주시",
                    "시급 13,500원", "08:00~13:00", "주 5일", "09.07", owner4, "남양주복지원", "경기 남양주시 요양보호사 모집 (오전)", namyangju));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "경기 평택시",
                    "시급 13,000원", "09:00~16:00", "주 5일", "09.07", owner5, "평택케어센터", "경기 평택시 요양보호사 모집 (주간)", pyeongtaek));
            jobRepository.save(new Job(null, "간병인 (주간)", "급구", "red", "경기 파주시",
                    "시급 13,000원", "09:00~18:00", "주 5일", "09.06", owner2, "파주노인복지관", "경기 파주시 간병인 급구", paju));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "인천 부평구",
                    "시급 14,000원", "09:00~15:00", "주 5일", "09.06", owner1, "부평케어서비스", "인천 부평구 요양보호사 모집 (주간)", incheonBupyeong));
            jobRepository.save(new Job(null, "요양보호사 (오후)", "신규", "blue", "서울 강북구",
                    "시급 13,800원", "13:00~18:00", "주 5일", "09.06", owner3, "강북재가센터", "서울 강북구 요양보호사 신규 모집 (오후)", gangbuk));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "서울 동작구",
                    "시급 14,000원", "09:00~15:00", "주 5일", "09.05", owner4, "동작복지재단", "서울 동작구 요양보호사 모집 (주간)", dongjak));
            jobRepository.save(new Job(null, "요양보호사 (야간)", "급구", "red", "경기 시흥시",
                    "시급 14,200원", "18:00~02:00", "주 5일", "09.05", owner5, "시흥야간케어센터", "경기 시흥시 요양보호사 급구 (야간)", siheung));
            jobRepository.save(new Job(null, "요양보호사 (주간)", null, null, "경기 광주시",
                    "시급 13,500원", "09:00~15:00", "주 5일", "09.05", owner2, "광주시복지원", "경기 광주시 요양보호사 모집 (주간)", gwangju));
            jobRepository.save(new Job(null, "간병인 (야간)", "급구", "red", "서울 중랑구",
                    "시급 14,500원", "22:00~06:00", "주 5일", "09.05", owner1, "중랑구야간케어", "서울 중랑구 간병인 급구 (야간)", jungnang));
            jobRepository.save(new Job(null, "요양보호사 (주간)", "신규", "blue", "경기 의정부시",
                    "시급 13,800원", "09:00~15:00", "주 5일", "09.05", owner3, "의정부복지재단", "경기 의정부시 요양보호사 신규 모집", uijeongbu));
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
