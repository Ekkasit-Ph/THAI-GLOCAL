package com.thaiglocal.webclient.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
            // กลับมาใช้ Public URL แบบเดิม
            .baseUrl("https://thai-glocal.onrender.com") 
            .defaultHeader("Content-Type", "application/json")
            .filter((request, next) -> {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest httpRequest = attributes.getRequest();
                    
                    // สร้าง Builder เพื่อเตรียมยัด Header หลายๆ ตัว
                    ClientRequest.Builder requestBuilder = ClientRequest.from(request);

                    // 🌟 1. ส่งต่อ IP จริงของ User เพื่อหลอก Firewall ของ Render ไม่ให้แจก 429 🌟
                    String forwardedFor = httpRequest.getHeader("X-Forwarded-For");
                    if (forwardedFor != null) {
                        requestBuilder.header("X-Forwarded-For", forwardedFor);
                    }
                    
                    // 🌟 2. ส่งต่อ User-Agent จริง (บอกว่าเป็น Chrome/Safari จริงๆ) 🌟
                    String userAgent = httpRequest.getHeader("User-Agent");
                    if (userAgent != null) {
                        requestBuilder.header("User-Agent", userAgent);
                    }

                    // 🌟 3. ส่งต่อ Cookie (ระบบเดิมของคุณ) 🌟
                    Cookie[] cookies = httpRequest.getCookies();
                    if (cookies != null) {
                        StringBuilder cookieHeader = new StringBuilder();
                        for (Cookie cookie : cookies) {
                            if (cookieHeader.length() > 0) cookieHeader.append("; ");
                            cookieHeader.append(cookie.getName()).append("=").append(cookie.getValue());
                        }
                        if (cookieHeader.length() > 0) {
                            requestBuilder.header("Cookie", cookieHeader.toString());
                        }
                    }
                    
                    // ทำการส่ง Request ที่แปะ IP และ Cookie แล้วออกไป
                    return next.exchange(requestBuilder.build());
                }
                return next.exchange(request);
            })
            .build();
    }

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}