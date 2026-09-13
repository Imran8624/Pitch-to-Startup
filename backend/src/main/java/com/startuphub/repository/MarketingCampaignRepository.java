package com.startuphub.repository;

import com.startuphub.entity.MarketingCampaignEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketingCampaignRepository extends JpaRepository<MarketingCampaignEntity, String> {
    List<MarketingCampaignEntity> findAllByOrderByCreatedAtDesc();
    List<MarketingCampaignEntity> findByProductNameIgnoreCase(String productName);
}
