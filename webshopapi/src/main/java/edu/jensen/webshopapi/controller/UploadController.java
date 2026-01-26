package edu.jensen.webshopapi.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
public class UploadController {

    @Value("${app.upload-dir:/Users/utbnadahm10/website/webshopapi/uploads}")
    private String uploadDir;
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @GetMapping("/api/uploads/{filename:.+}")
    public ResponseEntity<Resource> getUpload(@PathVariable String filename) throws Exception {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();

        System.out.println("TRYING FILE: " + filePath.toAbsolutePath());
        System.out.println("EXISTS: " + Files.exists(filePath));

        Resource resource = new UrlResource(filePath.toUri());


        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
