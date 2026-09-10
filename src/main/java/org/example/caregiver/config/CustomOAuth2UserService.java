package org.example.caregiver.config;

import org.example.caregiver.model.Member;
import org.example.caregiver.repository.MemberRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final MemberRepository memberRepository;

    public CustomOAuth2UserService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String email = "";
        String name = "";

        if ("naver".equals(registrationId)) {
            Map<String, Object> responseMap = (Map<String, Object>) attributes.get("response");
            email = (String) responseMap.get("email");
            name = (String) responseMap.get("name");
        } else if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            
            if (kakaoAccount != null && kakaoAccount.containsKey("email")) {
                email = (String) kakaoAccount.get("email");
            } else {
                email = attributes.get("id") + "@kakao.local";
            }
            
            if (properties != null && properties.containsKey("nickname")) {
                name = (String) properties.get("nickname");
            } else {
                name = "카카오사용자";
            }
        } else if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
        }

        final String finalEmail = email;

        // DB에 회원이 있는지 확인 후 없으면 저장
        Member member = null;
        Optional<Member> memberOpt = memberRepository.findAll().stream()
                .filter(m -> finalEmail.equals(m.getUsername()))
                .findFirst();

        if (memberOpt.isPresent()) {
            member = memberOpt.get();
        } else {
            member = new Member(finalEmail, "OAUTH_LOGIN", name, null);
            memberRepository.save(member);
        }

        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                userNameAttributeName
        );
    }
}
