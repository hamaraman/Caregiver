package org.example.caregiver.job;

public class HiredTermsUpdateRequest {

    private String startDate;
    private String days;
    private String hours;
    private String workType;
    private String wage;
    private String employForm;

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getDays() {
        return days;
    }

    public void setDays(String days) {
        this.days = days;
    }

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public String getWage() {
        return wage;
    }

    public void setWage(String wage) {
        this.wage = wage;
    }

    public String getEmployForm() {
        return employForm;
    }

    public void setEmployForm(String employForm) {
        this.employForm = employForm;
    }
}
