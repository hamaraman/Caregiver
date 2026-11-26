package org.example.caregiver.job;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class JobParsingTest {

    @Test
    void parsesWageString() {
        Job job = new Job();
        job.setWage("시급 14,000원");
        assertEquals("시급", job.getWageType());
        assertEquals(14000, job.getWageAmount());

        job.setWage("월급 2,500,000원");
        assertEquals(2500000, job.getWageAmount());

        job.setWage("협의");
        assertNull(job.getWageType());
        assertNull(job.getWageAmount());
    }

    @Test
    void monthDayUsesMostRecentPastDate() {
        LocalDate today = LocalDate.of(2026, 3, 10);
        assertEquals(LocalDate.of(2026, 3, 1), Job.fromMonthDay("03.01", today));
        assertEquals(LocalDate.of(2025, 12, 24), Job.fromMonthDay("12.24", today));
        assertNull(Job.fromMonthDay("02.30", today));
        assertNull(Job.fromMonthDay("abc", today));
        assertNull(Job.fromMonthDay(null, today));
    }
}
