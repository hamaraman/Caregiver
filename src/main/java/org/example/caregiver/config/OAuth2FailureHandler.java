package org.example.caregiver.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import java.io.IOException;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2FailureHandler.class);

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.warn("OAuth2 login failed", exception);
        String errorMessage = exception.getMessage() != null ? exception.getMessage() : "Unknown error";
        String encodedError = URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);

        String redirectOrigin = OAuth2RedirectOriginFilter.DEFAULT_ORIGIN;
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute(OAuth2RedirectOriginFilter.SESSION_ATTRIBUTE) instanceof String origin) {
            redirectOrigin = origin;
        }

        response.sendRedirect(redirectOrigin + "/?error=" + encodedError);
    }
}
