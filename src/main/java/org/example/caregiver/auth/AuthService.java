package org.example.caregiver.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

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
        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email == null ? "" : email)
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

    private String normalizeType(String userType) {
        return "business".equals(userType) ? "business" : "personal";
    }

    private String typeLabel(String userType) {
        return "business".equals(userType) ? "사업자용" : "개인회원";
    }
}
