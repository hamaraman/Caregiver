package org.example.caregiver.support;

public class InquiryResponse {

    private final Long id;
    private final String name;
    private final String email;
    private final String category;
    private final String message;
    private final String status;
    private final String createdAt;

    public InquiryResponse(Inquiry inquiry) {
        this.id = inquiry.getId();
        this.name = inquiry.getName();
        this.email = inquiry.getEmail();
        this.category = inquiry.getCategory();
        this.message = inquiry.getMessage();
        this.status = inquiry.getStatus();
        this.createdAt = inquiry.getCreatedAt();
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

    public String getStatus() {
        return status;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}
