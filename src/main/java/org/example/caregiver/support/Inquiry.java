package org.example.caregiver.support;

import jakarta.persistence.*;

@Entity
@Table(name = "inquiries")
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 비로그인 상태에서도 문의할 수 있어 로그인 사용자와 별개로 이름/이메일을 직접 입력받는다.
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String category;

    // @Lob을 쓰면 PostgreSQL에서 String이 oid(Large Object)로 매핑되어 본문이 별도 시스템 테이블에 저장되고
    // 행을 지워도 orphan으로 남는 문제가 있어, 대신 길이 제한 없는 일반 text 컬럼으로 지정한다.
    @Column(nullable = false, columnDefinition = "text")
    private String message;

    // 로그인한 상태에서 문의했다면 참고용으로만 보관 (비로그인 문의는 null)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private String createdAt;

    public Inquiry() {
    }

    public Inquiry(String name, String email, String category, String message, Long userId, String status, String createdAt) {
        this.name = name;
        this.email = email;
        this.category = category;
        this.message = message;
        this.userId = userId;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getCategory() {
        return category;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}
