package org.example.caregiver.auth;

public class UserResponse {

    private final Long id;
    private final String email;
    private final String name;
    private final String userType;
    private final String phone;
    private final String companyName;
    private final String businessNumber;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.userType = user.getUserType();
        this.phone = user.getPhone();
        this.companyName = user.getCompanyName();
        this.businessNumber = user.getBusinessNumber();
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

    public String getPhone() {
        return phone;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getBusinessNumber() {
        return businessNumber;
    }
}
