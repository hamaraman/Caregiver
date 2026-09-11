package org.example.caregiver.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.caregiver.auth.AuthService;
import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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
        String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
        String email = "";

        if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttribute("kakao_account");
            if (kakaoAccount != null && kakaoAccount.containsKey("email")) {
                email = (String) kakaoAccount.get("email");
            } else {
                email = oAuth2User.getAttribute("id") + "@kakao.local";
            }
        } else if ("naver".equals(registrationId)) {
            Map<String, Object> naverResponse = (Map<String, Object>) oAuth2User.getAttribute("response");
            email = (String) naverResponse.get("email");
        } else {
            // google
            email = oAuth2User.getAttribute("email");
        }

        final String finalEmail = email;

        Optional<User> userOpt = userRepository.findByEmail(finalEmail);
        if (userOpt.isPresent()) {
            HttpSession session = request.getSession();
            session.setAttribute(AuthService.SESSION_USER_ID, userOpt.get().getId());
            System.out.println("OAuth2 Login Success! userId=" + userOpt.get().getId() + " email=" + email);
        } else {
            System.out.println("OAuth2 Login failed: user not found in DB for email: " + email);
        }

        // 로그인 성공 후 프론트엔드 메인 페이지로 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:3000/");
    }
}
