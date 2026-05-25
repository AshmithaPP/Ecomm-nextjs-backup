export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getFallbackImageBase = () => {
  if (process.env.NEXT_PUBLIC_IMAGE_BASE_URL) {
    return process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Remove '/api' from the end of the URL to get the host base
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

export const IMAGE_BASE = getFallbackImageBase();

/**
 * Resolves media URLs by mapping localhost absolute addresses to the correct IMAGE_BASE
 * so they load correctly in live production environments, while keeping external URLs and
 * relative paths properly handled.
 */
export const resolveMediaUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== 'string') return '';
  
  // Expose backend API host base
  const apiHost = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

  // If it starts with local development backend URL, normalize it to the active host in the current browser.
  const normalizeLocalBackendUrl = (url: string) => {
    if (typeof window === 'undefined') return url;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    // If the app is served from localhost / 127.0.0.1, keep the original backend URL.
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return url;
    }

    // If the app is served from a local network host, point the asset URL to the same host on port 5000.
    return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1):5000/, `${protocol}//${hostname}:5000`);
  };

  if (url.startsWith('http://localhost:5000') || url.startsWith('https://localhost:5000') || url.startsWith('http://127.0.0.1:5000') || url.startsWith('https://127.0.0.1:5000')) {
    const isImageBaseProduction = IMAGE_BASE && !IMAGE_BASE.includes('localhost') && !IMAGE_BASE.includes('127.0.0.1');
    if (isImageBaseProduction) {
      return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1):5000/, IMAGE_BASE);
    }
    return normalizeLocalBackendUrl(url);
  }

  // If it's already an absolute external URL (e.g. S3 bucket, third-party, etc.), keep it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a review asset relative path, resolve it using the active backend API host instead of IMAGE_BASE
  if (url.includes('/uploads/reviews/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${apiHost}${cleanPath}`;
  }

  // If it's a relative path, ensure it starts with / and prepend IMAGE_BASE
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${IMAGE_BASE}${cleanPath}`;
};

