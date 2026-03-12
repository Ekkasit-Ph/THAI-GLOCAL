package com.thaiglocal.webclient.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CORSConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // 1. อนุญาต URL หน้าบ้าน (Vercel) - ใส่ URL ของคุณที่นี่
        // แนะนำ: ถ้ายังเทสต์อยู่และอยากให้ผ่านชัวร์ๆ ให้ใช้ "*" ไปก่อนได้ครับ
        corsConfig.setAllowedOrigins(Arrays.asList("https://thai-glocal-4fhx.vercel.app/"));
        
        // 2. อนุญาต Method ที่จำเป็นสำหรับการ SignUp/Login
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 3. อนุญาต Headers ทุกอย่าง (เช่น Content-Type, Authorization)
        corsConfig.addAllowedHeader("*");
        
        // 4. ตั้งเวลา Cache การตรวจ CORS (ช่วยให้ยิงเร็วขึ้น)
        corsConfig.setMaxAge(3600L);
        
        // 5. อนุญาตให้ส่ง Cookie หรือ Header พิเศษได้
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // ใช้ "/**" เพื่อให้มีผลกับทุก Endpoint ใน webClient
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
