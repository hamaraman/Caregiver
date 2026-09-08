package org.example.caregiver.model;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String badge;
    private String badgeColor;
    
    // location -> region 의 name으로 대체하거나 보조용으로 사용
    private String location; 
    
    private String wage;
    private String hours;
    private String days;
    private String date;
    private boolean liked;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    public Job() {}

    public Job(String title, String badge, String badgeColor, String location, String wage, String hours, String days, String date, boolean liked, Member member, Region region) {
        this.title = title;
        this.badge = badge;
        this.badgeColor = badgeColor;
        this.location = location;
        this.wage = wage;
        this.hours = hours;
        this.days = days;
        this.date = date;
        this.liked = liked;
        this.member = member;
        this.region = region;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getWage() { return wage; }
    public void setWage(String wage) { this.wage = wage; }
    public String getHours() { return hours; }
    public void setHours(String hours) { this.hours = hours; }
    public String getDays() { return days; }
    public void setDays(String days) { this.days = days; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public boolean isLiked() { return liked; }
    public void setLiked(boolean liked) { this.liked = liked; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
}
