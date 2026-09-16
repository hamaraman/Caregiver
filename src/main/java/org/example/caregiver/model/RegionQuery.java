package org.example.caregiver.model;

/**
 * Normalizes a "?region=" query param shared by the job and caregiver list
 * endpoints, so the blank-check/trim rule only needs to change in one place.
 */
public final class RegionQuery {

    private RegionQuery() {
    }

    /** Returns the trimmed region, or null if it should be treated as "no filter". */
    public static String normalize(String region) {
        if (region == null || region.trim().isEmpty()) {
            return null;
        }
        return region.trim();
    }
}
