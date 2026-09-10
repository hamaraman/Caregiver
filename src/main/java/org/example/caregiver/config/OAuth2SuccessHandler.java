package org.example.caregiver.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.caregiver.auth.AuthService;
import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email;

        if (oAuth2User.getAttributes().containsKey("kakao_account")) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttribute("kakao_account");
            if (kakaoAccount != null && kakaoAccount.containsKey("email")) {
                email = (String) kakaoAccount.get("email");
            } else {
                email = oAuth2User.getAttribute("id") + "@kakao.local";
            }
        } else if (oAuth2User.getAttributes().containsKey("response")) {
            Map<String, Object> naverResponse = (Map<String, Object>) oAuth2User.getAttribute("response");
            email = (String) naverResponse.get("email");
        } else {
            email = oAuth2User.getAttribute("email");
        }

        String normalizedEmail = email == null ? null : email.trim().toLowerCase();

        // CustomOAuth2UserService에서 이미 User를 찾거나 생성해 두었으므로 조회만 한다.
        Optional<User> userOpt = normalizedEmail == null ? Optional.empty() : userRepository.findByEmail(normalizedEmail);

        if (userOpt.isPresent()) {
            HttpSession existing = request.getSession(false);
            if (existing != null) {
                existing.invalidate();
            }
            HttpSession session = request.getSession(true);
            session.setAttribute(AuthService.SESSION_USER_ID, userOpt.get().getId());
            System.out.println("OAuth2 Login Success! Set session ID: " + session.getId() + " for user: " + normalizedEmail);
        } else {
            System.out.println("OAuth2 Login failed: user not found in DB for email: " + normalizedEmail);
        }

        // 로그인 성공 후 프론트엔드 메인 페이지로 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:3000/?page=home");
    }
}
