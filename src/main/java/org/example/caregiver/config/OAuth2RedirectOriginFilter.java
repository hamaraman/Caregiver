package org.example.caregiver.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.util.List;

/**
 * Remembers which frontend (job-seeker vs business) started a social login,
 * via the Referer header, so OAuth2SuccessHandler/OAuth2FailureHandler can
 * redirect back to that same app instead of always landing on one of them.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class OAuth2RedirectOriginFilter implements Filter {

    public static final String SESSION_ATTRIBUTE = "oauth2RedirectOrigin";
    public static final String DEFAULT_ORIGIN = "http://localhost:3000";

    private static final List<String> ALLOWED_ORIGINS = List.of(DEFAULT_ORIGIN, "http://localhost:5173");

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        if (httpRequest.getRequestURI().startsWith("/oauth2/authorization/")) {
            String origin = extractAllowedOrigin(httpRequest.getHeader("Referer"));
            if (origin != null) {
                httpRequest.getSession(true).setAttribute(SESSION_ATTRIBUTE, origin);
            }
        }
        chain.doFilter(request, response);
    }

    private String extractAllowedOrigin(String referer) {
        if (referer == null) {
            return null;
        }
        try {
            URI uri = URI.create(referer);
            String origin = uri.getScheme() + "://" + uri.getHost() + (uri.getPort() > 0 ? ":" + uri.getPort() : "");
            return ALLOWED_ORIGINS.contains(origin) ? origin : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
