package com.thaiglocal.webclient.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public FilterRegistrationBean<CorsFilter> customCorsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // 1. อนุญาตให้ส่ง Cookie/Token
        config.setAllowCredentials(true);
        
        // 2. ระบุโดเมนหน้าบ้าน (ย้ำ: ห้ามมี / ปิดท้าย)
        config.addAllowedOrigin("https://thai-glocal-4fhx.vercel.app");
        
        // 3. อนุญาตทุก Header
        config.addAllowedHeader("*");
        
        // 4. อนุญาตทุก Method (สำคัญมาก: มันจะคลุม OPTIONS ให้ด้วย)
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        // 5. บังคับให้ Filter นี้ทำงานเป็น "ลำดับแรกสุด" (Highest Precedence)
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE); 
        
        return bean;
    }
}
