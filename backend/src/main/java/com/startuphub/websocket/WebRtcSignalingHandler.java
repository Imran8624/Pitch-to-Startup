package com.startuphub.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebRtcSignalingHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    // roomId -> Set of WebSocketSessions
    private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    // sessionId -> roomId
    private final Map<String, String> sessionRoomMap = new ConcurrentHashMap<>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);
        String type = (String) payload.get("type");
        String roomId = (String) payload.get("roomId");

        if (type == null || roomId == null) return;

        switch (type) {
            case "JOIN_ROOM" -> handleJoinRoom(session, roomId, payload);
            case "OFFER", "ANSWER", "ICE_CANDIDATE" -> broadcastToOthersInRoom(session, roomId, message);
            case "LEAVE_ROOM" -> handleLeaveRoom(session, roomId);
            default -> session.sendMessage(new TextMessage("{\"error\": \"Unknown message type: " + type + "\"}"));
        }
    }

    private void handleJoinRoom(WebSocketSession session, String roomId, Map<String, Object> payload) throws IOException {
        roomSessions.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
        sessionRoomMap.put(session.getId(), roomId);

        Set<WebSocketSession> sessions = roomSessions.get(roomId);

        // Notify room members about new participant
        Map<String, Object> ack = new HashMap<>();
        ack.put("type", "ROOM_JOINED");
        ack.put("roomId", roomId);
        ack.put("peerCount", sessions.size());
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(ack)));

        if (sessions.size() > 1) {
            Map<String, Object> peerConnected = new HashMap<>();
            peerConnected.put("type", "PEER_CONNECTED");
            peerConnected.put("peerSessionId", session.getId());
            broadcastToOthersInRoom(session, roomId, new TextMessage(objectMapper.writeValueAsString(peerConnected)));
        }
    }

    private void broadcastToOthersInRoom(WebSocketSession senderSession, String roomId, TextMessage message) {
        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions == null) return;

        for (WebSocketSession session : sessions) {
            if (session.isOpen() && !session.getId().equals(senderSession.getId())) {
                try {
                    session.sendMessage(message);
                } catch (IOException e) {
                    sessionRoomMap.remove(session.getId());
                }
            }
        }
    }

    private void handleLeaveRoom(WebSocketSession session, String roomId) throws IOException {
        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                roomSessions.remove(roomId);
            } else {
                Map<String, Object> peerLeft = new HashMap<>();
                peerLeft.put("type", "PEER_LEFT");
                peerLeft.put("peerSessionId", session.getId());
                broadcastToOthersInRoom(session, roomId, new TextMessage(objectMapper.writeValueAsString(peerLeft)));
            }
        }
        sessionRoomMap.remove(session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = sessionRoomMap.get(session.getId());
        if (roomId != null) {
            handleLeaveRoom(session, roomId);
        }
    }
}
