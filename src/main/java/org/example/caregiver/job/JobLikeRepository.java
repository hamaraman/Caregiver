package org.example.caregiver.job;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class JobLikeRepository {

    private final Map<Long, Set<Long>> likedJobIdsByUserId = new ConcurrentHashMap<>();

    public boolean isLiked(Long userId, Long jobId) {
        if (userId == null) {
            return false;
        }
        Set<Long> likedJobIds = likedJobIdsByUserId.get(userId);
        return likedJobIds != null && likedJobIds.contains(jobId);
    }

    public void like(Long userId, Long jobId) {
        likedJobIdsByUserId.computeIfAbsent(userId, key -> ConcurrentHashMap.newKeySet()).add(jobId);
    }

    public void unlike(Long userId, Long jobId) {
        Set<Long> likedJobIds = likedJobIdsByUserId.get(userId);
        if (likedJobIds != null) {
            likedJobIds.remove(jobId);
        }
    }
}
