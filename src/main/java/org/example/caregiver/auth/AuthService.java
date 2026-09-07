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
        User user = new User(null, email, passwordEncoder.encode(request.getPassword()), request.getName());
        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email == null ? "" : email)
                .orElseThrow(() -> new AuthException("이메일 또는 비밀번호가 올바르지 않습니다."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        return user;
    }
}
