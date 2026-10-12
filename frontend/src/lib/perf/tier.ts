/**
 * Performance Tier Detection
 * 0: No WebGL (CSS poster only, full DOM usability)
 * 1: Low (Basic materials, reduced count, no post-processing)
 * 2: Mid (Shared FBO @ 0.5, vignette + subtle grain)
 * 3: High (Full pipeline, 1.0 FBO, chromatic dispersion, full post-processing)
 */

export type PerformanceTier = 0 | 1 | 2 | 3;

let cachedTier: PerformanceTier | null = null;

export function getPerformanceTier(): PerformanceTier {
  if (cachedTier !== null) {
    return cachedTier;
  }

  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!gl) {
      cachedTier = 0;
      return 0;
    }

    const debugInfo = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_debug_renderer_info"
    );
    const renderer = debugInfo
      ? (gl as WebGLRenderingContext).getParameter(
          debugInfo.UNMASKED_RENDERER_WEBGL
        ) || ""
      : "";

    const isSoftware = /swiftshader|llvmpipe|software/i.test(renderer);
    if (isSoftware) {
      cachedTier = 1;
      return 1;
    }

    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
    const isMobile =
      /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      window.innerWidth < 640;

    // Check high tier
    const isDedicatedGPU =
      /nvidia|geforce|radeon|apple m/i.test(renderer) ||
      (!isMobile && cores >= 8 && memory >= 8);

    if (isDedicatedGPU && !isMobile) {
      cachedTier = 3;
      return 3;
    }

    if (isMobile || cores <= 4 || memory <= 4) {
      cachedTier = cores <= 2 ? 1 : 2;
      return cachedTier;
    }

    cachedTier = 2;
    return 2;
  } catch {
    cachedTier = 1;
    return 1;
  }
}
