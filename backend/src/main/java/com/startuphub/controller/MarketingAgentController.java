package com.startuphub.controller;

import com.startuphub.service.MarketingAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/marketing")
public class MarketingAgentController {

    private final MarketingAgentService marketingAgentService;

    public MarketingAgentController(MarketingAgentService marketingAgentService) {
        this.marketingAgentService = marketingAgentService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generatePlaybook(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = marketingAgentService.generateCompleteMarketingPlaybook(payload);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refine")
    public ResponseEntity<?> refineAsset(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = marketingAgentService.refineMarketingAsset(payload);
        return ResponseEntity.ok(response);
    }
}
