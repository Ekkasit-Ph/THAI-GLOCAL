package com.thaiglocal.webclient.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity // สำคัญมากสำหรับ WebFlux
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            // 1. เปิดใช้งาน CORS ร่วมกับ Security
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 2. ปิด CSRF (ถ้าไม่ปิด จะยิง POST/PATCH ไม่ผ่านแน่นอน)
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            // 3. ปล่อยผ่านทุก Path ให้ไปคุยกับ Server หลักได้เลย
            .authorizeExchange(exchanges -> exchanges
                .anyExchange().permitAll()
            );
        
        return http.build();
    }

    // 4. ตั้งค่ารายละเอียด CORS (ห้ามมี / ปิดท้าย URL)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://thai-glocal-4fhx.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
