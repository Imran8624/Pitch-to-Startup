package com.startuphub.controller;

import com.startuphub.entity.JobApplicationEntity;
import com.startuphub.entity.StartupEntity;
import com.startuphub.entity.MarketingCampaignEntity;
import com.startuphub.service.DatabasePersistenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
public class PersistenceController {

    private final DatabasePersistenceService persistenceService;

    public PersistenceController(DatabasePersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    // --- Job Application Endpoints ---
    @GetMapping("/applications")
    public ResponseEntity<List<JobApplicationEntity>> getAllApplications() {
        return ResponseEntity.ok(persistenceService.getAllApplications());
    }

    @PostMapping("/applications")
    public ResponseEntity<JobApplicationEntity> saveApplication(@RequestBody JobApplicationEntity application) {
        return ResponseEntity.ok(persistenceService.saveApplication(application));
    }

    @PostMapping("/applications/batch")
    public ResponseEntity<List<JobApplicationEntity>> batchSaveApplications(@RequestBody List<JobApplicationEntity> applications) {
        return ResponseEntity.ok(persistenceService.batchSaveApplications(applications));
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable String id) {
        persistenceService.deleteApplication(id);
        return ResponseEntity.ok(Map.of("message", "Application deleted successfully", "id", id));
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.getOrDefault("status", "UNDER_REVIEW");
        String stageNote = payload.get("stageNote");
        JobApplicationEntity updated = persistenceService.updateApplicationStatus(id, status, stageNote);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // --- Startup Directory Endpoints ---
    @GetMapping("/startups")
    public ResponseEntity<List<StartupEntity>> getAllStartups(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String sector
    ) {
        return ResponseEntity.ok(persistenceService.getAllStartups(region, sector));
    }

    @PostMapping("/startups/sync-global")
    public ResponseEntity<Map<String, Object>> syncGlobalStartups() {
        List<StartupEntity> synced = persistenceService.syncGlobalStartups();
        Map<String, Object> stats = persistenceService.getGlobalEcosystemStats();
        return ResponseEntity.ok(Map.of(
                "message", "Global Startup Ecosystems synchronized successfully",
                "startups", synced,
                "stats", stats
        ));
    }

    @GetMapping("/startups/global-stats")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        return ResponseEntity.ok(persistenceService.getGlobalEcosystemStats());
    }

    @PostMapping("/startups")
    public ResponseEntity<StartupEntity> saveStartup(@RequestBody StartupEntity startup) {
        return ResponseEntity.ok(persistenceService.saveStartup(startup));
    }

    // --- Marketing Campaigns Endpoints ---
    @GetMapping("/marketing/campaigns")
    public ResponseEntity<List<MarketingCampaignEntity>> getAllCampaigns() {
        return ResponseEntity.ok(persistenceService.getAllMarketingCampaigns());
    }

    @PostMapping("/marketing/campaigns")
    public ResponseEntity<MarketingCampaignEntity> saveCampaign(@RequestBody MarketingCampaignEntity campaign) {
        return ResponseEntity.ok(persistenceService.saveMarketingCampaign(campaign));
    }
}
