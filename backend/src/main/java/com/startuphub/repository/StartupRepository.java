package com.startuphub.repository;

import com.startuphub.entity.StartupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StartupRepository extends JpaRepository<StartupEntity, String> {
    List<StartupEntity> findAllByOrderByCreatedAtDesc();
    List<StartupEntity> findBySectorIgnoreCase(String sector);
    List<StartupEntity> findByRegionIgnoreCase(String region);
    List<StartupEntity> findByCountryIgnoreCase(String country);
}

