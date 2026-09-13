package com.startuphub.config;

import com.startuphub.websocket.WebRtcSignalingHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
@EnableWebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer, WebSocketConfigurer {

    private final WebRtcSignalingHandler webRtcSignalingHandler;

    public WebSocketConfig(WebRtcSignalingHandler webRtcSignalingHandler) {
        this.webRtcSignalingHandler = webRtcSignalingHandler;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enable a simple in-memory STOMP broker for broadcast topics & private queues
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoint for frontend connections (SockJS & WebSocket fallback)
        registry.addEndpoint("/ws/stomp")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Register room-scoped WebRTC signaling handler for 1-on-1 video pitch calls
        registry.addHandler(webRtcSignalingHandler, "/ws/webrtc")
                .setAllowedOrigins("*");
    }
}
