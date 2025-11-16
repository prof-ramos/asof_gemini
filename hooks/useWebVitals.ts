'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { MetricType } from 'web-vitals';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function useWebVitals() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track in production and when analytics is enabled
    if (
      process.env.NODE_ENV !== 'production' ||
      !process.env.NEXT_PUBLIC_ENABLE_ANALYTICS
    ) {
      return;
    }

    // Import web-vitals v5 - subpath imports not available, use main import
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      const getCLS = onCLS;
      const getFID = onINP; // Use INP instead of FID
      const getFCP = onFCP;
      const getLCP = onLCP;
      const getTTFB = onTTFB;
      const reportWebVitals = (metric: MetricType) => {
        // Send to Vercel Analytics
        window.gtag?.('event', metric.name, {
          value: Math.round(metric.value * 1000) / 1000,
          event_category: 'Web Vitals',
          event_label: metric.id,
          custom_map: {
            metric_value: metric.value,
            metric_delta: metric.delta,
            metric_rating: metric.rating,
            page_path: pathname,
            navigation_type: metric.navigationType,
          },
        });

        // Send to custom analytics endpoint if available
        if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
          fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              metric: metric.name,
              value: metric.value,
              delta: metric.delta,
              rating: metric.rating,
              path: pathname,
              timestamp: Date.now(),
              userAgent: navigator.userAgent,
            }),
          }).catch((error) => {
            console.warn('Failed to send web vitals to custom endpoint:', error);
          });
        }
      };

      // Register all Core Web Vitals
      getCLS(reportWebVitals);
      getFID(reportWebVitals);
      getFCP(reportWebVitals);
      getLCP(reportWebVitals);
      getTTFB(reportWebVitals);
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, []); // Register once per page load

  return null;
}

// Utility function to get rating color for UI display
export function getVitalRatingColor(rating: MetricType['rating']): string {
  switch (rating) {
    case 'good':
      return 'text-green-600';
    case 'needs-improvement':
      return 'text-yellow-600';
    case 'poor':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

// Utility function to get rating description for UI display
export function getVitalRatingDescription(rating: MetricType['rating']): string {
  switch (rating) {
    case 'good':
      return 'Bom';
    case 'needs-improvement':
      return 'Precisa melhorar';
    case 'poor':
      return 'Ruim';
    default:
      return 'Desconhecido';
  }
}

// Thresholds for Core Web Vitals (in milliseconds for time-based metrics, unitless for CLS/INP)
export const WEB_VITALS_THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 }, // INP replaced FID in web-vitals v3+
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
} as const;
