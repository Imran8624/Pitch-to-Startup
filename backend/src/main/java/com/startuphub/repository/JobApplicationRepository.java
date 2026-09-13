package com.startuphub.repository;

import com.startuphub.entity.JobApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplicationEntity, String> {
    List<JobApplicationEntity> findAllByOrderByCreatedAtDesc();
    List<JobApplicationEntity> findByCandidateEmailOrderByCreatedAtDesc(String email);
    List<JobApplicationEntity> findByStatusOrderByCreatedAtDesc(String status);
}
