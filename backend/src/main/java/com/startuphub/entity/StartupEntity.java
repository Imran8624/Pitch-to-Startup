package com.startuphub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "startups")
public class StartupEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String sector;
    private String stage; // PRE_SEED, SEED, SERIES_A, SERIES_B
    private String valuation;
    private String arr;
    private String arrGrowthPct;
    private String mrr;
    private String totalFunding;
    private String founder;
    private String kycStatus; // VERIFIED, PENDING

    // Global Hub & Location metadata
    private String region; // NORTH_AMERICA, EUROPE, ASIA_PACIFIC, MIDDLE_EAST, LATAM_AFRICA, GLOBAL_REMOTE
    private String city;
    private String country;
    private String flag;
    private String ecosystemHub;
    private String connectionStatus; // CONNECTED_ACTIVE, SYNCED_REALTIME, VERIFIED_PARTNER
    private Boolean crossBorderReady;
    private Integer openPositionsCount;
    private Integer activeInvestorsCount;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String tagline;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String logoUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String stakeholdersJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String fundingLedgerJson;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StartupEntity() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.crossBorderReady = true;
        this.connectionStatus = "CONNECTED_ACTIVE";
        this.openPositionsCount = 4;
        this.activeInvestorsCount = 8;
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

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getValuation() { return valuation; }
    public void setValuation(String valuation) { this.valuation = valuation; }

    public String getArr() { return arr; }
    public void setArr(String arr) { this.arr = arr; }

    public String getArrGrowthPct() { return arrGrowthPct; }
    public void setArrGrowthPct(String arrGrowthPct) { this.arrGrowthPct = arrGrowthPct; }

    public String getMrr() { return mrr; }
    public void setMrr(String mrr) { this.mrr = mrr; }

    public String getTotalFunding() { return totalFunding; }
    public void setTotalFunding(String totalFunding) { this.totalFunding = totalFunding; }

    public String getFounder() { return founder; }
    public void setFounder(String founder) { this.founder = founder; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getFlag() { return flag; }
    public void setFlag(String flag) { this.flag = flag; }

    public String getEcosystemHub() { return ecosystemHub; }
    public void setEcosystemHub(String ecosystemHub) { this.ecosystemHub = ecosystemHub; }

    public String getConnectionStatus() { return connectionStatus; }
    public void setConnectionStatus(String connectionStatus) { this.connectionStatus = connectionStatus; }

    public Boolean getCrossBorderReady() { return crossBorderReady; }
    public void setCrossBorderReady(Boolean crossBorderReady) { this.crossBorderReady = crossBorderReady; }

    public Integer getOpenPositionsCount() { return openPositionsCount; }
    public void setOpenPositionsCount(Integer openPositionsCount) { this.openPositionsCount = openPositionsCount; }

    public Integer getActiveInvestorsCount() { return activeInvestorsCount; }
    public void setActiveInvestorsCount(Integer activeInvestorsCount) { this.activeInvestorsCount = activeInvestorsCount; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStakeholdersJson() { return stakeholdersJson; }
    public void setStakeholdersJson(String stakeholdersJson) { this.stakeholdersJson = stakeholdersJson; }

    public String getFundingLedgerJson() { return fundingLedgerJson; }
    public void setFundingLedgerJson(String fundingLedgerJson) { this.fundingLedgerJson = fundingLedgerJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
