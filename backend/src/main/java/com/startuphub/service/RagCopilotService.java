package com.startuphub.service;

import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class RagCopilotService {

    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public RagCopilotService(@Autowired(required = false) VectorStore vectorStore,
                             @Autowired(required = false) ChatClient chatClient) {
        this.vectorStore = vectorStore;
        this.chatClient = chatClient;
    }

    /**
     * Ingest founder pitch deck PDF into pgvector store
     */
    public int ingestPitchDeckPdf(Resource pdfResource, String startupId, String founderId) {
        PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(pdfResource);
        List<Document> documents = pdfReader.get();

        TokenTextSplitter textSplitter = new TokenTextSplitter(500, 100, 10, 5000, true);
        List<Document> splitDocuments = textSplitter.apply(documents);

        // Attach startup & founder metadata
        for (Document doc : splitDocuments) {
            doc.getMetadata().put("startupId", startupId);
            doc.getMetadata().put("founderId", founderId);
            doc.getMetadata().put("sourceType", "PITCH_DECK");
        }

        vectorStore.accept(splitDocuments);
        return splitDocuments.size();
    }

    /**
     * Role-aware RAG query for founders (pitch deck scoring) or investors (due diligence)
     */
    public Map<String, Object> queryCopilot(String query, String userRole, String startupId) {
        // Retrieve relevant document chunks using pgvector HNSW similarity search
        SearchRequest searchRequest = SearchRequest.query(query)
                .withTopK(4)
                .withSimilarityThreshold(0.6);

        List<Document> similarDocs = vectorStore.similaritySearch(searchRequest);
        String contextText = similarDocs.stream()
                .map(Document::getContent)
                .collect(Collectors.joining("\n---\n"));

        String systemPrompt;
        if ("INVESTOR".equalsIgnoreCase(userRole)) {
            systemPrompt = """
                You are StartupHub's Lead VC Due-Diligence AI Copilot.
                Analyze the founder's pitch deck context below to evaluate financial metrics (MRR, ARR, CAC, LTV), market size, moat, risks, and founder credibility.
                Provide quantitative answers with strict metric citations based ONLY on the provided context.
                
                PITCH DECK CONTEXT:
                {context}
                
                INVESTOR QUESTION:
                {query}
                """;
        } else {
            systemPrompt = """
                You are StartupHub's Expert Pitch Structure & Venture Scoring AI Copilot for Founders.
                Analyze the pitch deck context below and rate the deck structure on Problem, Solution, Traction, Market Size, Business Model, and Ask.
                Provide actionable feedback to improve founder pitch storytelling.
                
                PITCH DECK CONTEXT:
                {context}
                
                FOUNDER QUESTION:
                {query}
                """;
        }

        PromptTemplate template = new PromptTemplate(systemPrompt);
        Prompt prompt = template.create(Map.of("context", contextText, "query", query));

        String aiResponse = chatClient.call(prompt).getResult().getOutput().getContent();

        List<String> citations = similarDocs.stream()
                .map(doc -> "Page Chunk [ID: " + doc.getId() + "]: " + doc.getContent().substring(0, Math.min(120, doc.getContent().length())) + "...")
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("answer", aiResponse);
        result.put("citations", citations);
        result.put("roleContext", userRole);
        result.put("chunksRetrieved", similarDocs.size());

        return result;
    }
}
