package org.example.caregiver.job;

import java.util.List;

public class JobCreateRequest {

    private String title;
    private String badge;
    private String badgeColor;
    private String location;
    private String wage;
    private String hours;
    private String days;
    private String date;
    private String companyName;
    private String postTitle;

    // 근무 조건 상세
    private String jobType;
    private String facility;
    private String workForm;
    private String employForm;
    private String education;
    private String experience;
    private String deadline;
    private Boolean daysNegotiable;
    private List<String> weekdays;

    // 케어 대상자 정보
    private String careGender;
    private String careAge;
    private String careGrade;
    private List<String> careCondition;
    private List<String> careWork;

    // 공고 내용
    private String postDetail;
    private List<String> applyMethod;
    private String companyUrl;
    private String applyEmail;
    private String applyFax;

    // 업체/담당자 정보
    private String companyPhone;
    private String companyAddr;
    private String companyAddrDetail;
    private String phonePublic;
    private String managerName;
    private String managerPhone;
    private String managerEmail;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getBadgeColor() {
        return badgeColor;
    }

    public void setBadgeColor(String badgeColor) {
        this.badgeColor = badgeColor;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWage() {
        return wage;
    }

    public void setWage(String wage) {
        this.wage = wage;
    }

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }

    public String getDays() {
        return days;
    }

    public void setDays(String days) {
        this.days = days;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getFacility() {
        return facility;
    }

    public void setFacility(String facility) {
        this.facility = facility;
    }

    public String getWorkForm() {
        return workForm;
    }

    public void setWorkForm(String workForm) {
        this.workForm = workForm;
    }

    public String getEmployForm() {
        return employForm;
    }

    public void setEmployForm(String employForm) {
        this.employForm = employForm;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public Boolean getDaysNegotiable() {
        return daysNegotiable;
    }

    public void setDaysNegotiable(Boolean daysNegotiable) {
        this.daysNegotiable = daysNegotiable;
    }

    public List<String> getWeekdays() {
        return weekdays;
    }

    public void setWeekdays(List<String> weekdays) {
        this.weekdays = weekdays;
    }

    public String getCareGender() {
        return careGender;
    }

    public void setCareGender(String careGender) {
        this.careGender = careGender;
    }

    public String getCareAge() {
        return careAge;
    }

    public void setCareAge(String careAge) {
        this.careAge = careAge;
    }

    public String getCareGrade() {
        return careGrade;
    }

    public void setCareGrade(String careGrade) {
        this.careGrade = careGrade;
    }

    public List<String> getCareCondition() {
        return careCondition;
    }

    public void setCareCondition(List<String> careCondition) {
        this.careCondition = careCondition;
    }

    public List<String> getCareWork() {
        return careWork;
    }

    public void setCareWork(List<String> careWork) {
        this.careWork = careWork;
    }

    public String getPostDetail() {
        return postDetail;
    }

    public void setPostDetail(String postDetail) {
        this.postDetail = postDetail;
    }

    public List<String> getApplyMethod() {
        return applyMethod;
    }

    public void setApplyMethod(List<String> applyMethod) {
        this.applyMethod = applyMethod;
    }

    public String getCompanyUrl() {
        return companyUrl;
    }

    public void setCompanyUrl(String companyUrl) {
        this.companyUrl = companyUrl;
    }

    public String getApplyEmail() {
        return applyEmail;
    }

    public void setApplyEmail(String applyEmail) {
        this.applyEmail = applyEmail;
    }

    public String getApplyFax() {
        return applyFax;
    }

    public void setApplyFax(String applyFax) {
        this.applyFax = applyFax;
    }

    public String getCompanyPhone() {
        return companyPhone;
    }

    public void setCompanyPhone(String companyPhone) {
        this.companyPhone = companyPhone;
    }

    public String getCompanyAddr() {
        return companyAddr;
    }

    public void setCompanyAddr(String companyAddr) {
        this.companyAddr = companyAddr;
    }

    public String getCompanyAddrDetail() {
        return companyAddrDetail;
    }

    public void setCompanyAddrDetail(String companyAddrDetail) {
        this.companyAddrDetail = companyAddrDetail;
    }

    public String getPhonePublic() {
        return phonePublic;
    }

    public void setPhonePublic(String phonePublic) {
        this.phonePublic = phonePublic;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getManagerPhone() {
        return managerPhone;
    }

    public void setManagerPhone(String managerPhone) {
        this.managerPhone = managerPhone;
    }

    public String getManagerEmail() {
        return managerEmail;
    }

    public void setManagerEmail(String managerEmail) {
        this.managerEmail = managerEmail;
    }
}
