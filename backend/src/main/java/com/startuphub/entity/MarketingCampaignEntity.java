package com.startuphub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marketing_campaigns")
public class MarketingCampaignEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String productName;

    private String industry;
    private String targetAudience;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String valueProposition;

    private String tone;
    private Integer humaneScore;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String playbookJson;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MarketingCampaignEntity() {
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

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public String getValueProposition() { return valueProposition; }
    public void setValueProposition(String valueProposition) { this.valueProposition = valueProposition; }

    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }

    public Integer getHumaneScore() { return humaneScore; }
    public void setHumaneScore(Integer humaneScore) { this.humaneScore = humaneScore; }

    public String getPlaybookJson() { return playbookJson; }
    public void setPlaybookJson(String playbookJson) { this.playbookJson = playbookJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
