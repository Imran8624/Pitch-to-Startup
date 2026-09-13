package com.startuphub.config;

import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.vectorstore.PgVectorStore;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class VectorStoreConfig {

    @Bean
    public VectorStore vectorStore(@Autowired(required = false) JdbcTemplate jdbcTemplate,
                                    @Autowired(required = false) EmbeddingClient embeddingClient) {
        if (embeddingClient != null) {
            try {
                if (jdbcTemplate != null && isPostgres(jdbcTemplate)) {
                    return new PgVectorStore(jdbcTemplate, embeddingClient);
                }
            } catch (Throwable ignored) {}
            return new SimpleVectorStore(embeddingClient);
        }
        return null;
    }

    private boolean isPostgres(JdbcTemplate jdbcTemplate) {
        try {
            String dbName = jdbcTemplate.execute((java.sql.Connection conn) -> conn.getMetaData().getDatabaseProductName());
            return dbName != null && dbName.toLowerCase().contains("postgresql");
        } catch (Throwable t) {
            return false;
        }
    }
}
