package org.example.caregiver.job;

import java.util.List;

public class JobResponse {

    private final Long id;
    private final String title;
    private final String badge;
    private final String badgeColor;
    private final String location;
    private final String wage;
    private final String hours;
    private final String days;
    private final String date;
    private final String companyName;
    private final String postTitle;
    private final Long ownerId;
    private final boolean liked;

    private final String jobType;
    private final String facility;
    private final String workForm;
    private final String employForm;
    private final String education;
    private final String experience;
    private final String deadline;
    private final Boolean daysNegotiable;
    private final List<String> weekdays;

    private final String careGender;
    private final String careAge;
    private final String careGrade;
    private final List<String> careCondition;
    private final List<String> careWork;

    private final String postDetail;
    private final List<String> applyMethod;
    private final String companyUrl;
    private final String applyEmail;
    private final String applyFax;

    private final String companyPhone;
    private final String companyAddr;
    private final String companyAddrDetail;
    private final String phonePublic;
    private final String managerName;
    private final String managerPhone;
    private final String managerEmail;

    public JobResponse(Job job, boolean liked) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.badge = job.getBadge();
        this.badgeColor = job.getBadgeColor();
        this.location = job.getLocation();
        this.wage = job.getWage();
        this.hours = job.getHours();
        this.days = job.getDays();
        this.date = job.getDate();
        this.companyName = job.getCompanyName();
        this.postTitle = job.getPostTitle();
        this.ownerId = job.getOwner() != null ? job.getOwner().getId() : null;
        this.liked = liked;

        this.jobType = job.getJobType();
        this.facility = job.getFacility();
        this.workForm = job.getWorkForm();
        this.employForm = job.getEmployForm();
        this.education = job.getEducation();
        this.experience = job.getExperience();
        this.deadline = job.getDeadline();
        this.daysNegotiable = job.getDaysNegotiable();
        this.weekdays = job.getWeekdays();

        this.careGender = job.getCareGender();
        this.careAge = job.getCareAge();
        this.careGrade = job.getCareGrade();
        this.careCondition = job.getCareCondition();
        this.careWork = job.getCareWork();

        this.postDetail = job.getPostDetail();
        this.applyMethod = job.getApplyMethod();
        this.companyUrl = job.getCompanyUrl();
        this.applyEmail = job.getApplyEmail();
        this.applyFax = job.getApplyFax();

        this.companyPhone = job.getCompanyPhone();
        this.companyAddr = job.getCompanyAddr();
        this.companyAddrDetail = job.getCompanyAddrDetail();
        this.phonePublic = job.getPhonePublic();
        this.managerName = job.getManagerName();
        this.managerPhone = job.getManagerPhone();
        this.managerEmail = job.getManagerEmail();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getBadge() {
        return badge;
    }

    public String getBadgeColor() {
        return badgeColor;
    }

    public String getLocation() {
        return location;
    }

    public String getWage() {
        return wage;
    }

    public String getHours() {
        return hours;
    }

    public String getDays() {
        return days;
    }

    public String getDate() {
        return date;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getPostTitle() {
        return postTitle;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public boolean isLiked() {
        return liked;
    }

    public String getJobType() {
        return jobType;
    }

    public String getFacility() {
        return facility;
    }

    public String getWorkForm() {
        return workForm;
    }

    public String getEmployForm() {
        return employForm;
    }

    public String getEducation() {
        return education;
    }

    public String getExperience() {
        return experience;
    }

    public String getDeadline() {
        return deadline;
    }

    public Boolean getDaysNegotiable() {
        return daysNegotiable;
    }

    public List<String> getWeekdays() {
        return weekdays;
    }

    public String getCareGender() {
        return careGender;
    }

    public String getCareAge() {
        return careAge;
    }

    public String getCareGrade() {
        return careGrade;
    }

    public List<String> getCareCondition() {
        return careCondition;
    }

    public List<String> getCareWork() {
        return careWork;
    }

    public String getPostDetail() {
        return postDetail;
    }

    public List<String> getApplyMethod() {
        return applyMethod;
    }

    public String getCompanyUrl() {
        return companyUrl;
    }

    public String getApplyEmail() {
        return applyEmail;
    }

    public String getApplyFax() {
        return applyFax;
    }

    public String getCompanyPhone() {
        return companyPhone;
    }

    public String getCompanyAddr() {
        return companyAddr;
    }

    public String getCompanyAddrDetail() {
        return companyAddrDetail;
    }

    public String getPhonePublic() {
        return phonePublic;
    }

    public String getManagerName() {
        return managerName;
    }

    public String getManagerPhone() {
        return managerPhone;
    }

    public String getManagerEmail() {
        return managerEmail;
    }
}
