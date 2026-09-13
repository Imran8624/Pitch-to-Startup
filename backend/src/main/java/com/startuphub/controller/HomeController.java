package com.startuphub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
            "status", "ONLINE",
            "service", "StartupHub Backend API",
            "version", "1.0.0",
            "frontendUrl", "http://localhost:3000",
            "h2ConsoleUrl", "http://localhost:8080/h2-console",
            "message", "StartupHub backend is running! Open http://localhost:3000 in your browser to view the application UI."
        ));
    }

    @GetMapping("/api/v1/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
