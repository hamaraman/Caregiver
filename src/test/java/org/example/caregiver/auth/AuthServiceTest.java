package org.example.caregiver.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AuthServiceTest {

    private final UserRepository users = mock(UserRepository.class);
    private final AuthService service = new AuthService(users);
    private final String hash = new BCryptPasswordEncoder().encode("correct-pw");

    @Test
    void registerNormalizesEmailAndHashesPassword() {
        when(users.save(any())).thenAnswer(inv -> inv.getArgument(0));

        User u = service.register(register("  Kim@Example.COM ", "pw12345678", "personal"));

        assertEquals("kim@example.com", u.getEmail());
        assertNotEquals("pw12345678", u.getPasswordHash());
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(users.existsByEmail("kim@example.com")).thenReturn(true);
        assertThrows(AuthException.class, () -> service.register(register("kim@example.com", "pw", "personal")));
        verify(users, never()).save(any());
    }

    @Test
    void registerRejectsAdminType() {
        assertThrows(AuthException.class, () -> service.register(register("a@example.com", "pw", "admin")));
    }

    @Test
    void loginWithWrongPasswordFails() {
        when(users.findByEmail("kim@example.com"))
                .thenReturn(Optional.of(new User(1L, "kim@example.com", hash, "김", "personal")));
        assertThrows(AuthException.class, () -> service.login(login("kim@example.com", "wrong", "personal")));
    }

    @Test
    void loginRejectsWrongAccountTab() {
        when(users.findByEmail("kim@example.com"))
                .thenReturn(Optional.of(new User(1L, "kim@example.com", hash, "김", "personal")));
        assertThrows(AuthException.class, () -> service.login(login("kim@example.com", "correct-pw", "business")));
    }

    @Test
    void adminCanLoginFromAnyTab() {
        when(users.findByEmail("admin@example.com"))
                .thenReturn(Optional.of(new User(1L, "admin@example.com", hash, "관리자", "admin")));
        assertEquals("admin", service.login(login("admin@example.com", "correct-pw", "personal")).getUserType());
    }

    @Test
    void passwordResetIsDisabled() {
        assertThrows(AuthException.class, () -> service.resetPassword(new ResetPasswordRequest()));
        verify(users, never()).save(any());
    }

    private static RegisterRequest register(String email, String pw, String type) {
        RegisterRequest r = new RegisterRequest();
        r.setEmail(email);
        r.setPassword(pw);
        r.setUserType(type);
        r.setName("김");
        return r;
    }

    private static LoginRequest login(String email, String pw, String type) {
        LoginRequest r = new LoginRequest();
        r.setEmail(email);
        r.setPassword(pw);
        r.setUserType(type);
        return r;
    }
}
