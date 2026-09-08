package org.example.caregiver.job;

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
    private final boolean liked;

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
        this.liked = liked;
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

    public boolean isLiked() {
        return liked;
    }
}
