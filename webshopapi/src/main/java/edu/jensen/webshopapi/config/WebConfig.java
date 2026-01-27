package edu.jensen.webshopapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

   @Value("${app.upload-dir:/Users/utbnadham10/website/webshopapi/uploads}")
private String uploadDir;


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    System.out.println("UPLOADS SERVED FROM: " + uploadDir);

    registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:" + uploadDir + "/");
        }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://192.168.0.212:3000")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}


