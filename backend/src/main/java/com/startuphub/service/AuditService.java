package com.startuphub.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class AuditService {

    private final Queue<Map<String, Object>> auditLogsInMemory = new ConcurrentLinkedQueue<>();

    public void logAction(String actorId, String actorName, String actionType, String entityName, String entityId, Map<String, Object> details) {
        Map<String, Object> log = new HashMap<>();
        log.put("id", UUID.randomUUID().toString());
        log.put("actorId", actorId);
        log.put("actorName", actorName);
        log.put("actionType", actionType);
        log.put("entityName", entityName);
        log.put("entityId", entityId);
        log.put("changeDetailsJson", details);
        log.put("ipAddress", "127.0.0.1");
        log.put("createdAt", Instant.now().toString());

        auditLogsInMemory.add(log);
    }

    public List<Map<String, Object>> getAllLogs() {
        return new ArrayList<>(auditLogsInMemory);
    }
}
