package org.example.caregiver.config;

import java.util.Map;

/**
 * Pulls email/name out of each provider's differently-shaped OAuth2User attributes.
 * Shared by CustomOAuth2UserService (find-or-create the User) and OAuth2SuccessHandler
 * (look the User back up) so the two stay in sync.
 */
final class OAuth2UserInfoExtractor {

    private OAuth2UserInfoExtractor() {
    }

    @SuppressWarnings("unchecked")
    static String extractEmail(String registrationId, Map<String, Object> attributes) {
        if ("naver".equals(registrationId)) {
            Map<String, Object> responseMap = (Map<String, Object>) attributes.get("response");
            return responseMap == null ? null : (String) responseMap.get("email");
        }
        if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount != null && kakaoAccount.containsKey("email")) {
                return (String) kakaoAccount.get("email");
            }
            return attributes.get("id") + "@kakao.local";
        }
        if ("google".equals(registrationId)) {
            return (String) attributes.get("email");
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    static String extractName(String registrationId, Map<String, Object> attributes) {
        if ("naver".equals(registrationId)) {
            Map<String, Object> responseMap = (Map<String, Object>) attributes.get("response");
            return responseMap == null ? null : (String) responseMap.get("name");
        }
        if ("kakao".equals(registrationId)) {
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            if (properties != null && properties.containsKey("nickname")) {
                return (String) properties.get("nickname");
            }
            return "카카오사용자";
        }
        if ("google".equals(registrationId)) {
            return (String) attributes.get("name");
        }
        return null;
    }
}
