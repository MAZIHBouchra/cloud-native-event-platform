package com.convene.api.controllers;

import com.convene.api.services.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "events") String folder) {
        
        Map<String, String> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            String imageUrl = s3Service.uploadImage(file, folder);
            response.put("url", imageUrl);
            response.put("message", "Image uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (IllegalStateException e) {
            response.put("error", "S3 service is not configured: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        } catch (S3Exception e) {
            response.put("error", "S3 error: " + e.getMessage());
            response.put("awsErrorCode", e.awsErrorDetails().errorCode());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (IOException e) {
            response.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            response.put("error", "Unexpected error: " + e.getMessage());
            response.put("details", e.getClass().getSimpleName());
            e.printStackTrace(); // Log to console for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

