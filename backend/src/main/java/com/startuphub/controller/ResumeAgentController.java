package com.startuphub.controller;

import com.startuphub.service.ResumeAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/resume")
public class ResumeAgentController {

    private final ResumeAgentService resumeAgentService;

    public ResumeAgentController(ResumeAgentService resumeAgentService) {
        this.resumeAgentService = resumeAgentService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<?> optimizeResume(@RequestBody Map<String, String> payload) {
        String resumeText = payload.getOrDefault("resumeText", "");
        String targetRole = payload.getOrDefault("targetRole", "Fullstack AI Engineer");
        String jobDescription = payload.getOrDefault("jobDescription", "");
        String experienceLevel = payload.getOrDefault("experienceLevel", "Mid-Senior");

        Map<String, Object> response = resumeAgentService.analyzeAndTailorResume(
                resumeText, targetRole, jobDescription, experienceLevel
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cold-email-recovery")
    public ResponseEntity<?> generateColdEmailRecovery(@RequestBody Map<String, String> payload) {
        String candidateName = payload.getOrDefault("candidateName", "Alex Vance");
        String startupName = payload.getOrDefault("startupName", "Quantum AI Labs");
        String roleTitle = payload.getOrDefault("roleTitle", "Lead AI Infrastructure Engineer");
        String hrName = payload.getOrDefault("hrName", "Hiring Team");
        String techStack = payload.getOrDefault("techStack", "Spring Boot, pgvector & React");

        Map<String, Object> response = resumeAgentService.generateRejectionRecoveryOutreach(
                candidateName, startupName, roleTitle, hrName, techStack
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/batch-auto-apply")
    public ResponseEntity<?> batchAutoApply(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = resumeAgentService.processBatchAutoApply(payload);
        return ResponseEntity.ok(response);
    }
}

