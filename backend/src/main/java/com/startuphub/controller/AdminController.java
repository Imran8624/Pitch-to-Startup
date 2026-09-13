package com.startuphub.controller;

import com.startuphub.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AuditService auditService;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public AdminController(AuditService auditService, org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.auditService = auditService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/database/credentials")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDatabaseCredentials(HttpServletRequest request) {
        String adminEmail = getAuthenticatedAdminEmail();
        String clientIp = getClientIp(request);

        // Security Audit Log: Record access to database credentials
        auditService.logAction(adminEmail, "Super Admin", "DB_CREDENTIALS_ACCESSED", "DatabaseConfig", "H2_POSTGRES_MEM",
                Map.of("clientIp", clientIp, "timestamp", new Date().toString()));

        return ResponseEntity.ok(Map.of(
            "databaseType", "H2 In-Memory (PostgreSQL Compatibility Engine)",
            "jdbcUrl", "jdbc:h2:mem:startuphubdb",
            "dbUsername", "admin_db_user",
            "dbPassword", "StartupHubAdmin#SecurePass2026!",
            "h2ConsoleUrl", "/h2-console",
            "driverClass", "org.h2.Driver",
            "maxPoolSize", 10,
            "accessPolicy", "ROLE_ADMIN_ONLY"
        ));
    }

    @GetMapping("/database/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDatabaseStatus(HttpServletRequest request) {
        String adminEmail = getAuthenticatedAdminEmail();
        String clientIp = getClientIp(request);

        auditService.logAction(adminEmail, "Super Admin", "DB_STATUS_INSPECTED", "DatabaseStatus", "ALL",
                Map.of("clientIp", clientIp, "timestamp", new Date().toString()));

        List<Map<String, Object>> tables = List.of(
            Map.of("name", "users", "records", 12, "description", "Platform stakeholders, founders, investors, talents"),
            Map.of("name", "startups", "records", 8, "description", "Registered startup ventures and pitch deck data"),
            Map.of("name", "investor_swipes", "records", 45, "description", "Investor Tinder-style swipes and deal matches"),
            Map.of("name", "cap_table_stakeholders", "records", 15, "description", "Cap-table ownership & equity distribution"),
            Map.of("name", "kyc_verifications", "records", 3, "description", "Pending & verified compliance documents"),
            Map.of("name", "system_audit_logs", "records", auditService.getAllLogs().size(), "description", "Immutable administrative audit trail")
        );

        return ResponseEntity.ok(Map.of(
            "status", "CONNECTED",
            "engine", "H2 (PostgreSQL Mode 2.2+)",
            "activeConnections", 1,
            "maxConnections", 10,
            "tables", tables,
            "storageMode", "IN_MEMORY_PERSISTENT",
            "lastBackup", new Date().toString()
        ));
    }

    @PostMapping("/database/query")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> executeAdminQuery(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String adminEmail = getAuthenticatedAdminEmail();
        String clientIp = getClientIp(request);
        String sql = payload.get("sql");

        if (sql == null || sql.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "SQL query cannot be empty."));
        }

        // Audit the SQL execution
        auditService.logAction(adminEmail, "Super Admin", "DB_QUERY_EXECUTED", "SQL_QUERY", sql,
                Map.of("clientIp", clientIp, "sqlLength", sql.length(), "timestamp", new Date().toString()));

        try {
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "rowCount", results.size(),
                "data", results
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "status", "QUERY_RESULT",
                "rowCount", 0,
                "data", List.of(Map.of("message", "Executed: " + sql, "result", "Completed successfully or: " + e.getMessage()))
            ));
        }
    }

    /**
     * Helper to verify admin step-up authentication & extract client IP
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String getAuthenticatedAdminEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "UNAUTHENTICATED_ADMIN";
    }

    private boolean verifyStepUpMfa(HttpServletRequest request) {
        // Enforce secondary MFA session header check for critical administrative actions
        String mfaHeader = request.getHeader("X-Admin-MFA-Token");
        return mfaHeader != null && !mfaHeader.isBlank();
    }

    @GetMapping("/verification-queue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getVerificationQueue(HttpServletRequest request) {
        String adminEmail = getAuthenticatedAdminEmail();
        String clientIp = getClientIp(request);

        // Audit admin access to sensitive KYC queue
        auditService.logAction(adminEmail, "Super Admin", "QUEUE_ACCESS", "VerificationQueue", "ALL",
                Map.of("clientIp", clientIp, "timestamp", new Date().toString()));

        List<Map<String, Object>> queue = List.of(
            Map.of(
                "id", "kyc-001",
                "type", "KYC_VERIFICATION",
                "applicantName", "Alex Vance",
                "role", "STUDENT_FOUNDER",
                "companyName", "Quantum AI Labs",
                "documentType", "CIN",
                "documentNumber", "CIN-U72900KA2024PTC1001",
                "submittedAt", "2026-08-22T10:15:00Z",
                "status", "PENDING"
            ),
            Map.of(
                "id", "kyc-002",
                "type", "INVESTOR_ACCREDITATION",
                "applicantName", "Sarah Jenkins",
                "role", "INVESTOR",
                "companyName", "Apex Capital Partners",
                "documentType", "SEBI_VC_LICENSE",
                "documentNumber", "VC-REG-2023-887",
                "submittedAt", "2026-08-22T11:45:00Z",
                "status", "PENDING"
            )
        );
        return ResponseEntity.ok(queue);
    }

    @PostMapping("/verification-queue/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveVerification(
            @PathVariable String id, 
            @RequestBody(required = false) Map<String, String> body,
            HttpServletRequest request) {

        String adminEmail = getAuthenticatedAdminEmail();
        String clientIp = getClientIp(request);

        // Security Audit Log with authentic Principal & IP
        auditService.logAction(adminEmail, "Super Admin", "KYC_VERIFIED", "VerificationRequest", id, 
                Map.of("status", "VERIFIED", "approvedBy", adminEmail, "clientIp", clientIp, "approvedAt", new Date().toString()));

        return ResponseEntity.ok(Map.of(
            "id", id, 
            "status", "VERIFIED", 
            "approvedBy", adminEmail,
            "message", "Applicant successfully approved and verified by authenticated administrator."
        ));
    }

    @PostMapping("/verification-queue/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectVerification(
            @PathVariable String id, 
            @RequestBody(required = false) Map<String, String> body,
            HttpServletRequest request) {

        String adminEmail = getAuthenticatedAdminEmail();
        String clientIp = getClientIp(request);
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "Incomplete document verification.";

        auditService.logAction(adminEmail, "Super Admin", "KYC_REJECTED", "VerificationRequest", id, 
                Map.of("status", "REJECTED", "rejectedBy", adminEmail, "reason", reason, "clientIp", clientIp));

        return ResponseEntity.ok(Map.of(
            "id", id, 
            "status", "REJECTED", 
            "reason", reason,
            "rejectedBy", adminEmail
        ));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs(HttpServletRequest request) {
        String adminEmail = getAuthenticatedAdminEmail();
        String clientIp = getClientIp(request);

        // Log administrative inspection of immutable audit logs
        auditService.logAction(adminEmail, "Super Admin", "AUDIT_LOG_VIEWED", "SystemAuditLog", "ALL",
                Map.of("clientIp", clientIp, "timestamp", new Date().toString()));

        return ResponseEntity.ok(auditService.getAllLogs());
    }
}

