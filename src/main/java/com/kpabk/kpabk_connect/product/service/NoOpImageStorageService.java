package com.kpabk.kpabk_connect.product.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Placeholder implementation when S3/MinIO is not configured.
 * Product and category imageUrl can be set manually (e.g. external URL) in create/update requests.
 * Replace with S3ImageStorageService or MinIOImageStorageService when storage is ready.
 */
@Service
public class NoOpImageStorageService implements ImageStorageService {

    @Override
    public String upload(MultipartFile file, String prefix) {
        throw new UnsupportedOperationException(
                "Image upload not configured. Set imageUrl directly on product/category or configure S3/MinIO.");
    }

    @Override
    public void deleteByUrl(String imageUrl) {
        // no-op
    }
}
