package org.example.caregiver.job;

import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import org.example.caregiver.auth.User;
import org.example.caregiver.model.Region;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String badge;
    private String badgeColor;
    private String location;
    private String wage;
    private String hours;
    private String days;
    private String date;

    // wage/date는 화면 표시용 문자열("시급 14,000원", "09.06")이라 정렬·범위 검색이 안 돼서 타입 있는 컬럼을 같이 둔다.
    // ponytail: 표시용 문자열 컬럼과 이중 저장 중. 프론트가 아래 값으로 직접 포맷하게 되면 문자열 컬럼 제거
    @Column(name = "wage_type")
    private String wageType;

    @Column(name = "wage_amount")
    private Integer wageAmount;

    @Column(name = "posted_on")
    private LocalDate postedOn;

    private String companyName;
    private String postTitle;
    private boolean closed;

    // 근무 조건 상세
    private String jobType;
    private String facility;
    private String workForm;
    private String employForm;
    private String education;
    private String experience;
    private String deadline;
    private Boolean daysNegotiable;

    @ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    @CollectionTable(name = "job_weekdays", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "weekday")
    private List<String> weekdays = new ArrayList<>();

    // 케어 대상자 정보
    private String careGender;
    private String careAge;
    private String careGrade;

    @ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    @CollectionTable(name = "job_care_conditions", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "care_condition_item")
    private List<String> careCondition = new ArrayList<>();

    @ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    @CollectionTable(name = "job_care_works", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "care_work_item")
    private List<String> careWork = new ArrayList<>();

    // 공고 내용
    @Column(length = 2000)
    private String postDetail;

    @ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    @CollectionTable(name = "job_apply_methods", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "apply_method_item")
    private List<String> applyMethod = new ArrayList<>();

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    public Job() {
    }

    public Job(Long id, String title, String badge, String badgeColor, String location,
                String wage, String hours, String days, String date,
                User owner, String companyName, String postTitle) {
        this(id, title, badge, badgeColor, location, wage, hours, days, date, owner, companyName, postTitle, null);
    }

    public Job(Long id, String title, String badge, String badgeColor, String location,
                String wage, String hours, String days, String date,
                User owner, String companyName, String postTitle, Region region) {
        this.id = id;
        this.title = title;
        this.badge = badge;
        this.badgeColor = badgeColor;
        this.location = location;
        setWage(wage);
        this.hours = hours;
        this.days = days;
        this.date = date;
        this.postedOn = fromMonthDay(date, LocalDate.now());
        this.owner = owner;
        this.companyName = companyName;
        this.postTitle = postTitle;
        this.region = region;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        Matcher m = wage == null ? null : WAGE_PATTERN.matcher(wage.trim());
        if (m != null && m.matches()) {
            this.wageType = m.group(1);
            this.wageAmount = Integer.parseInt(m.group(2).replace(",", ""));
        } else {
            this.wageType = null;
            this.wageAmount = null;
        }
    }

    public String getWageType() {
        return wageType;
    }

    public Integer getWageAmount() {
        return wageAmount;
    }

    public LocalDate getPostedOn() {
        return postedOn;
    }

    public void setPostedOn(LocalDate postedOn) {
        this.postedOn = postedOn;
    }

    private static final Pattern WAGE_PATTERN = Pattern.compile("([^ ]+) +([0-9,]+)원");

    /**
     * 연도 없이 저장된 "MM.dd"를 LocalDate로 바꾼다. today 기준 올해로 보고, 미래 날짜가 되면 작년으로 본다.
     * ponytail: 1년 넘게 지난 데이터는 연도를 알 수 없어 1년 이내로 가정
     */
    static LocalDate fromMonthDay(String monthDay, LocalDate today) {
        if (monthDay == null) return null;
        Matcher m = MONTH_DAY.matcher(monthDay.trim());
        if (!m.matches()) return null;
        try {
            LocalDate d = LocalDate.of(today.getYear(), Integer.parseInt(m.group(1)), Integer.parseInt(m.group(2)));
            return d.isAfter(today) ? d.minusYears(1) : d;
        } catch (java.time.DateTimeException e) {
            return null;
        }
    }

    private static final Pattern MONTH_DAY = Pattern.compile("([0-9]{1,2})[.]([0-9]{1,2})");

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

    public boolean isClosed() {
        return closed;
    }

    public void setClosed(boolean closed) {
        this.closed = closed;
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
        this.weekdays = weekdays != null ? weekdays : new ArrayList<>();
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
        this.careCondition = careCondition != null ? careCondition : new ArrayList<>();
    }

    public List<String> getCareWork() {
        return careWork;
    }

    public void setCareWork(List<String> careWork) {
        this.careWork = careWork != null ? careWork : new ArrayList<>();
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
        this.applyMethod = applyMethod != null ? applyMethod : new ArrayList<>();
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }
}
