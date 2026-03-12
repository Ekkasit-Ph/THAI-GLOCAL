package com.thaiglocal.webclient.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity // ใช้ตัวนี้เพราะเรามี WebMVC อยู่ในโปรเจกต์
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. ปิด CORS ของ Security ทิ้งไปเลย (เพราะเราใช้ CorsConfig.java จัดการแทนแล้ว)
            .cors(cors -> cors.disable()) 
            // 2. ปิด CSRF ตามเดิม
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // อนุญาต Vercel (ห้ามมี / ปิดท้าย)
        configuration.setAllowedOrigins(Arrays.asList("https://thai-glocal-4fhx.vercel.app"));
        
        // อนุญาต Method ทุกอย่างที่ต้องใช้
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // อนุญาต Headers ทุกอย่าง
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // สำคัญ: อนุญาตให้ส่ง Cookie ได้ (สัมพันธ์กับ WebClientConfig ของคุณ)
        configuration.setAllowCredentials(true);
        
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
