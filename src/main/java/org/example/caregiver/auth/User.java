package org.example.caregiver.auth;

public class User {

    private Long id;
    private String email;
    private String passwordHash;
    private String name;
    private String userType;

    public User(Long id, String email, String passwordHash, String name, String userType) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.userType = userType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getName() {
        return name;
    }

    public String getUserType() {
        return userType;
    }
}
