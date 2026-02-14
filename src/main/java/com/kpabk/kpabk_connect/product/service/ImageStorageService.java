package com.kpabk.kpabk_connect.product.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction for object storage (S3 / MinIO). Implement with S3Client or MinIO client.
 * Store only the returned URL in the database; this service handles upload and optional delete.
 */
public interface ImageStorageService {

    /**
     * Upload a file and return the public (or signed) URL to store in DB.
     *
     * @param file   the uploaded file
     * @param prefix optional path prefix (e.g. "products", "categories")
     * @return the URL to store in the product/category imageUrl field
     */
    String upload(MultipartFile file, String prefix);

    /**
     * Optional: delete object by URL when product/category is updated or deleted.
     * No-op if URL is null or implementation does not support delete.
     */
    void deleteByUrl(String imageUrl);
}
