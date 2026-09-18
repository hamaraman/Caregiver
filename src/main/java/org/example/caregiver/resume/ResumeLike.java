package org.example.caregiver.resume;

import jakarta.persistence.*;

@Entity
@Table(name = "resume_likes", uniqueConstraints = @UniqueConstraint(columnNames = {"resume_id", "user_id"}))
public class ResumeLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resume_id", nullable = false)
    private Long resumeId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public ResumeLike() {}

    public ResumeLike(Long resumeId, Long userId) {
        this.resumeId = resumeId;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public Long getResumeId() { return resumeId; }
    public Long getUserId() { return userId; }
}
