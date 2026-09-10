package org.example.caregiver.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.caregiver.auth.AuthService;
import org.example.caregiver.auth.User;
import org.example.caregiver.auth.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2SuccessHandler.class);

    private final UserRepository userRepository;

    public OAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
        String email = OAuth2UserInfoExtractor.extractEmail(registrationId, oAuth2User.getAttributes());

        String normalizedEmail = email == null ? null : email.trim().toLowerCase();

        // CustomOAuth2UserService에서 이미 User를 찾거나 생성해 두었으므로 조회만 한다.
        Optional<User> userOpt = normalizedEmail == null ? Optional.empty() : userRepository.findByEmail(normalizedEmail);

        String redirectOrigin = OAuth2RedirectOriginFilter.DEFAULT_ORIGIN;
        HttpSession existing = request.getSession(false);
        if (existing != null) {
            Object storedOrigin = existing.getAttribute(OAuth2RedirectOriginFilter.SESSION_ATTRIBUTE);
            if (storedOrigin instanceof String origin) {
                redirectOrigin = origin;
            }
            existing.invalidate();
        }

        if (userOpt.isPresent()) {
            HttpSession session = request.getSession(true);
            session.setAttribute(AuthService.SESSION_USER_ID, userOpt.get().getId());
            log.info("OAuth2 login success, session {} for user {}", session.getId(), normalizedEmail);
        } else {
            log.warn("OAuth2 login failed: user not found in DB for email {}", normalizedEmail);
        }

        // 로그인을 시작한 프론트엔드로 되돌려보낸다 (Referer로 식별 안 되면 구직자 앱으로 기본 리다이렉트)
        getRedirectStrategy().sendRedirect(request, response, redirectOrigin + "/?page=home");
    }
}
