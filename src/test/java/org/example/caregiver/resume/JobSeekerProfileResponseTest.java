package org.example.caregiver.resume;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class JobSeekerProfileResponseTest {

    @Test
    void publicViewHidesPhone() {
        JobSeekerProfile profile = new JobSeekerProfile();
        profile.setName("김요양");
        profile.setPhone("010-1234-5678");

        assertNull(JobSeekerProfileResponse.withoutContact(profile).getPhone());
        assertEquals("김요양", JobSeekerProfileResponse.withoutContact(profile).getName());
        assertEquals("010-1234-5678", new JobSeekerProfileResponse(profile).getPhone());
    }
}
