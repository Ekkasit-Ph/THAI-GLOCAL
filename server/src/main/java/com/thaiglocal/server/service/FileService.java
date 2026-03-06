package com.thaiglocal.server.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

public class FileService {
    private final Cloudinary cloudinary;

    public FileService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file) throws IOException {
        // upload file to Cloudinary
        
        Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "thaiglocal_centers"));

        // get URL
        return uploadResult.get("secure_url").toString();
    }

    public void deleteImage(String imageUrl) {
        try {
            if (imageUrl == null || imageUrl.isEmpty()) return;

            String publicId = imageUrl.substring(
                    imageUrl.indexOf("thaiglocal_centers/"),
                    imageUrl.lastIndexOf(".")
            );

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("Deleted " + publicId);

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image: " + e.getMessage());
        }
    }
}
