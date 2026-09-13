package com.startuphub.controller;

import com.startuphub.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/v1/investor/swipes")
public class InvestorSwipeController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AuditService auditService;

    public InvestorSwipeController(SimpMessagingTemplate messagingTemplate, AuditService auditService) {
        this.messagingTemplate = messagingTemplate;
        this.auditService = auditService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INVESTOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> recordSwipe(@RequestBody Map<String, String> payload) {
        String investorId = payload.get("investorId");
        String startupId = payload.get("startupId");
        String direction = payload.get("direction"); // "RIGHT_LIKE" or "LEFT_PASS"

        boolean isMatch = "RIGHT_LIKE".equalsIgnoreCase(direction);
        String matchId = isMatch ? UUID.randomUUID().toString() : null;
        String roomId = isMatch ? "pitch-room-" + UUID.randomUUID().toString().substring(0, 8) : null;

        Map<String, Object> response = new HashMap<>();
        response.put("swipeId", UUID.randomUUID().toString());
        response.put("investorId", investorId);
        response.put("startupId", startupId);
        response.put("direction", direction);
        response.put("isMatch", isMatch);
        response.put("swipedAt", Instant.now().toString());

        if (isMatch) {
            response.put("matchId", matchId);
            response.put("roomId", roomId);
            response.put("meetingLink", "/video-room/" + roomId);
            response.put("message", "It's a Match! You can now schedule a 1-on-1 pitch call with the founder.");

            // Dispatch real-time STOMP notification to founder's private queue
            Map<String, Object> notifyMessage = new HashMap<>();
            notifyMessage.put("type", "SWIPE_MATCH");
            notifyMessage.put("title", "New Investor Interest!");
            notifyMessage.put("message", "An accredited investor swiped right on your startup. Room unlocked: " + roomId);
            notifyMessage.put("matchId", matchId);
            notifyMessage.put("roomId", roomId);

            messagingTemplate.convertAndSendToUser(startupId, "/queue/messages", notifyMessage);

            // Audit record
            auditService.logAction(investorId, "Investor", "SWIPE_MATCH_CREATED", "Startup", startupId,
                    Map.of("direction", direction, "matchId", matchId, "roomId", roomId));
        }

        return ResponseEntity.ok(response);
    }
}
