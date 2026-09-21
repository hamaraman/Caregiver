package org.example.caregiver.support;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class InquiryService {

    private static final DateTimeFormatter CREATED_AT_FORMAT = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");

    private final InquiryJpaRepository inquiryJpaRepository;

    public InquiryService(InquiryJpaRepository inquiryJpaRepository) {
        this.inquiryJpaRepository = inquiryJpaRepository;
    }

    public InquiryResponse submit(InquiryRequest request, Long userId) {
        String name = blankToNull(request.getName());
        String email = blankToNull(request.getEmail());
        String category = blankToNull(request.getCategory());
        String message = blankToNull(request.getMessage());

        if (name == null || email == null || category == null || message == null) {
            throw new InquiryException("이름, 이메일, 문의 유형, 문의 내용을 모두 입력해주세요.");
        }

        Inquiry inquiry = new Inquiry(
                name, email, category, message, userId,
                "접수", LocalDateTime.now().format(CREATED_AT_FORMAT));
        return new InquiryResponse(inquiryJpaRepository.save(inquiry));
    }

    public List<InquiryResponse> getAll() {
        return inquiryJpaRepository.findAllByOrderByIdDesc().stream()
                .map(InquiryResponse::new)
                .toList();
    }

    public InquiryResponse updateStatus(Long id, String status) {
        Inquiry inquiry = inquiryJpaRepository.findById(id)
                .orElseThrow(() -> new InquiryException("존재하지 않는 문의입니다."));
        inquiry.setStatus(status);
        return new InquiryResponse(inquiryJpaRepository.save(inquiry));
    }

    private String blankToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
