package com.convene.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;
    private final String bucketName;
    private final String cloudfrontUrl;
    private final String region;

    public S3Service(@Autowired(required = false) S3Client s3Client,
                     @Value("${aws.s3.bucket-name}") String bucketName,
                     @Value("${aws.s3.cloudfront-url:}") String cloudfrontUrl,
                     @Value("${aws.s3.region:us-east-1}") String region) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.cloudfrontUrl = cloudfrontUrl;
        this.region = region;
    }

    /**
     * Uploads an image file to S3 and returns the public URL
     *
     * @param file The image file to upload
     * @param folder The folder path in S3 (e.g., "events", "users")
     * @return The public URL of the uploaded image
     * @throws IOException if file reading fails
     * @throws S3Exception if S3 upload fails
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (s3Client == null) {
            throw new IllegalStateException("S3 client is not configured. Please set AWS credentials.");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 5MB");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = folder + "/" + UUID.randomUUID() + extension;

        // Upload to S3
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(contentType)
                .build();

        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (software.amazon.awssdk.services.s3.model.S3Exception e) {
            if (e.statusCode() == 307) {
                // Region mismatch - try to get the correct region from the error
                throw new IllegalStateException("Bucket region mismatch. The bucket '"
                    + bucketName + "' is not in region '" + region 
                    + "'. Please check your bucket region in AWS Console and update aws.s3.region in application.properties");
            }
            throw e;
        }

        // Return URL (use CloudFront if configured, otherwise S3 URL)
        if (cloudfrontUrl != null && !cloudfrontUrl.isEmpty()) {
            return cloudfrontUrl + "/" + fileName;
        } else {
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
        }
    }

    /**
     * Deletes an image from S3
     *
     * @param imageUrl The full URL of the image to delete
     */
    public void deleteImage(String imageUrl) {
        if (s3Client == null || imageUrl == null || imageUrl.isEmpty()) {
            return;
        }

        try {
            // Extract the key from the URL
            String key = extractKeyFromUrl(imageUrl);
            if (key != null) {
                s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key).build());
            }
        } catch (Exception e) {
            // Log error but don't throw (image might not exist)
            System.err.println("Failed to delete image from S3: " + e.getMessage());
        }
    }

    private String extractKeyFromUrl(String url) {
        // Extract key from S3 URL or CloudFront URL
        if (url.contains(bucketName + ".s3")) {
            // S3 URL format: https://bucket.s3.region.amazonaws.com/key
            int index = url.indexOf(bucketName) + bucketName.length() + 1;
            return url.substring(index);
        } else if (cloudfrontUrl != null && url.contains(cloudfrontUrl)) {
            // CloudFront URL format: https://cloudfront-url/key
            return url.substring(cloudfrontUrl.length() + 1);
        }
        return null;
    }
}

