/**
 * Optimize Cloudinary images for better performance
 * @param imageUrl - Original Cloudinary URL
 * @param width - Desired width in pixels
 * @param quality - Image quality (auto, 80, 75, etc.)
 * @returns Optimized Cloudinary URL
 */
export function optimizeCloudinaryUrl(
  imageUrl: string | null | undefined,
  width = 400,
  quality = 'auto'
): string {
  if (!imageUrl) return '';

  // Check if it's a Cloudinary URL
  if (imageUrl.includes('cloudinary')) {
    // Insert transformation parameters before /upload/
    return imageUrl.replace('/upload/', `/upload/w_${width},q_${quality}/`);
  }

  // For non-Cloudinary URLs, return as-is
  return imageUrl;
}

/**
 * Get optimized product image URL
 */
export function getProductImageUrl(imageUrl: string | null | undefined): string {
  return optimizeCloudinaryUrl(imageUrl, 300, 'auto');
}

/**
 * Get optimized detail image URL
 */
export function getDetailImageUrl(imageUrl: string | null | undefined): string {
  return optimizeCloudinaryUrl(imageUrl, 600, 'auto');
}

/**
 * Get optimized thumbnail URL
 */
export function getThumbnailUrl(imageUrl: string | null | undefined): string {
  return optimizeCloudinaryUrl(imageUrl, 100, '80');
}

/**
 * Get optimized avatar URL
 */
export function getAvatarUrl(imageUrl: string | null | undefined): string {
  return optimizeCloudinaryUrl(imageUrl, 80, 'auto');
}
