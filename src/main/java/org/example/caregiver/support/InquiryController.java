package org.example.caregiver.support;

import jakarta.servlet.http.HttpServletRequest;
import org.example.caregiver.auth.AuthService;
import org.example.caregiver.auth.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 1:1 문의는 로그인 없이도 접수할 수 있어야 하므로 로그인 사용자 확인은 하지 않고,
// 로그인 상태라면 참고용으로만 userId를 함께 저장한다.
@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;
    private final AuthService authService;

    public InquiryController(InquiryService inquiryService, AuthService authService) {
        this.inquiryService = inquiryService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<InquiryResponse> submit(@RequestBody InquiryRequest request, HttpServletRequest httpRequest) {
        Long userId = authService.currentUser(httpRequest).map(User::getId).orElse(null);
        InquiryResponse response = inquiryService.submit(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @ExceptionHandler(InquiryException.class)
    public ResponseEntity<String> handleInquiryException(InquiryException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
