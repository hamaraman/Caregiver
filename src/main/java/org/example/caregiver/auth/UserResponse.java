package org.example.caregiver.auth;

public class UserResponse {

    private final Long id;
    private final String email;
    private final String name;
    private final String userType;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.userType = user.getUserType();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getUserType() {
        return userType;
    }
}
