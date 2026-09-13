package com.startuphub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplicationEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String startupName;

    @Column(nullable = false)
    private String title;

    private String roleType;
    private String appliedDate;
    private String status; // UNDER_REVIEW, INTERVIEW_SCHEDULED, OFFER_RECEIVED, REJECTED
    private Integer atsMatchScore;
    private String compensation;

    @Column(length = 2000)
    private String stageNote;

    private String techStack; // comma separated
    private String resumeUsed;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String tailoredResumeContent;

    @Column(length = 2000)
    private String coverNote;

    private String candidateName;
    private String candidateEmail;
    private Boolean isAutoDiscovered;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JobApplicationEntity() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStartupName() { return startupName; }
    public void setStartupName(String startupName) { this.startupName = startupName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRoleType() { return roleType; }
    public void setRoleType(String roleType) { this.roleType = roleType; }

    public String getAppliedDate() { return appliedDate; }
    public void setAppliedDate(String appliedDate) { this.appliedDate = appliedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAtsMatchScore() { return atsMatchScore; }
    public void setAtsMatchScore(Integer atsMatchScore) { this.atsMatchScore = atsMatchScore; }

    public String getCompensation() { return compensation; }
    public void setCompensation(String compensation) { this.compensation = compensation; }

    public String getStageNote() { return stageNote; }
    public void setStageNote(String stageNote) { this.stageNote = stageNote; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public String getResumeUsed() { return resumeUsed; }
    public void setResumeUsed(String resumeUsed) { this.resumeUsed = resumeUsed; }

    public String getTailoredResumeContent() { return tailoredResumeContent; }
    public void setTailoredResumeContent(String tailoredResumeContent) { this.tailoredResumeContent = tailoredResumeContent; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public Boolean getIsAutoDiscovered() { return isAutoDiscovered; }
    public void setIsAutoDiscovered(Boolean autoDiscovered) { isAutoDiscovered = autoDiscovered; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
