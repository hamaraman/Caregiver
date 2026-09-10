package org.example.caregiver.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public static final String SESSION_USER_ID = "userId";

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest request) {
        String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase();
        if (email == null || email.isEmpty() || request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new AuthException("이메일과 비밀번호를 입력해주세요.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new AuthException("이미 가입된 이메일입니다.");
        }
        String userType = normalizeType(request.getUserType());
        User user = new User(null, email, passwordEncoder.encode(request.getPassword()), request.getName(), userType);
        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            // existsByEmail 체크와 save 사이의 경쟁 상태(동시 가입 요청)로 unique 제약이 걸린 경우
            throw new AuthException("이미 가입된 이메일입니다.");
        }
    }

    public User login(LoginRequest request) {
        String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase();
        if (email == null || email.isEmpty() || request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new AuthException("이메일과 비밀번호를 입력해주세요.");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("이메일 또는 비밀번호가 올바르지 않습니다."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        String requestedType = normalizeType(request.getUserType());
        if (!requestedType.equals(user.getUserType())) {
            throw new AuthException(typeLabel(user.getUserType()) + " 계정입니다. " + typeLabel(requestedType) + " 탭에서는 로그인할 수 없습니다.");
        }
        return user;
    }

    public Optional<User> currentUser(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        Long userId = session == null ? null : (Long) session.getAttribute(SESSION_USER_ID);
        if (userId == null) {
            return Optional.empty();
        }
        return userRepository.findById(userId);
    }

    private String normalizeType(String userType) {
        return "business".equals(userType) ? "business" : "personal";
    }

    private String typeLabel(String userType) {
        return "business".equals(userType) ? "사업자용" : "개인회원";
    }
}
