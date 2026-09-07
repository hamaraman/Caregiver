package org.example.caregiver.auth;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong();

    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(email));
    }

    public Optional<User> findById(Long id) {
        return usersByEmail.values().stream()
                .filter(user -> user.getId().equals(id))
                .findFirst();
    }

    public boolean existsByEmail(String email) {
        return usersByEmail.containsKey(email);
    }

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(sequence.incrementAndGet());
        }
        usersByEmail.put(user.getEmail(), user);
        return user;
    }
}
