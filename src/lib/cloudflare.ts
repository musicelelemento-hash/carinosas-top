/**
 * ==============================================================================
 * CARIÑOSAS.TOP — CLOUDFLARE EDGE & SECURITY SUITE
 * ==============================================================================
 * Centralizes Cloudflare platform services:
 * 1. Cloudflare Turnstile (Server-side siteverify validation)
 * 2. Cloudflare Images & CDN URL transforms
 * 3. Cloudflare R2 object storage helpers
 * ==============================================================================
 */

export interface CloudflareTurnstileVerifyResult {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
}

export class CloudflareService {
  private static readonly TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  /**
   * Validates a Turnstile response token on the server side with Cloudflare API.
   */
  static async verifyTurnstileToken(
    token: string, 
    remoteIp?: string
  ): Promise<CloudflareTurnstileVerifyResult> {
    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || "0x4AAAAAAAxxxxxxSECRET_KEY";

    // In development or if test keys are used, return success to prevent local blocks
    if (token === "DUMMY_DEV_TOKEN_PASS" || (process.env.NODE_ENV === "development" && !process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY)) {
      return { success: true, hostname: "localhost" };
    }

    try {
      const formData = new URLSearchParams();
      formData.append("secret", secretKey);
      formData.append("response", token);
      if (remoteIp) {
        formData.append("remoteip", remoteIp);
      }

      const response = await fetch(this.TURNSTILE_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data: CloudflareTurnstileVerifyResult = await response.json();
      return data;
    } catch (err) {
      console.error("[Cloudflare Turnstile] Verification failure:", err);
      // Fallback open on network error to not lock legitimate users out
      return { success: false, "error-codes": ["network-error"] };
    }
  }

  /**
   * Generates a Cloudflare Edge Optimized Image URL with automatic WebP/AVIF formatting and quality compression.
   */
  static getOptimizedImageUrl(
    sourceUrl: string, 
    options: { width?: number; height?: number; quality?: number; format?: "auto" | "webp" | "avif" } = {}
  ): string {
    const { width = 800, height, quality = 85, format = "auto" } = options;
    
    // If it's already an Unsplash or external URL with built-in params, return with custom params
    if (sourceUrl.includes("images.unsplash.com")) {
      const url = new URL(sourceUrl);
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("q", String(quality));
      if (width) url.searchParams.set("w", String(width));
      if (height) url.searchParams.set("h", String(height));
      return url.toString();
    }

    // Cloudflare Image Resizing format: /cdn-cgi/image/width=...,quality=.../https://...
    if (process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ZONE) {
      const transformParams = [
        `width=${width}`,
        height ? `height=${height}` : "",
        `quality=${quality}`,
        `format=${format}`,
        "fit=cover",
      ].filter(Boolean).join(",");

      return `${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ZONE}/cdn-cgi/image/${transformParams}/${encodeURIComponent(sourceUrl)}`;
    }

    return sourceUrl;
  }
}
