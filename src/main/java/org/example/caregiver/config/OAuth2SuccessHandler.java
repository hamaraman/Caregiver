package org.example.caregiver.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.caregiver.model.Member;
import org.example.caregiver.repository.MemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final MemberRepository memberRepository;

    public OAuth2SuccessHandler(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = "";
        
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

        final String finalEmail = email;

        // DB에서 회원 조회
        Optional<Member> memberOpt = memberRepository.findAll().stream()
                .filter(m -> finalEmail.equals(m.getUsername()))
                .findFirst();

        if (memberOpt.isPresent()) {
            // 기존 컨트롤러에서 사용하던 방식대로 세션에 ID 저장
            HttpSession session = request.getSession();
            session.setAttribute("memberId", memberOpt.get().getId());
            System.out.println("OAuth2 Login Success! Set session ID: " + session.getId() + " for member: " + email);
        } else {
            System.out.println("OAuth2 Login failed: member not found in DB for email: " + email);
        }

        // 로그인 성공 후 프론트엔드 메인 페이지로 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:3000/?page=home");
    }
}
