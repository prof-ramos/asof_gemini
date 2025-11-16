'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: string;
}

export default function WebVitalsMonitor() {
  const reportWebVitals = (metric: any) => {
    const value = Math.round(metric.value);
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good';

    // Rating thresholds (Google standards)
    switch (metric.name) {
      case 'LCP':
        rating = value > 2500 ? 'poor' : value > 1200 ? 'needs-improvement' : 'good';
        break;
      case 'FID':
        rating = value > 300 ? 'poor' : value > 100 ? 'needs-improvement' : 'good';
        break;
      case 'CLS':
        rating = value > 250 ? 'poor' : value > 100 ? 'needs-improvement' : 'good';
        break;
      case 'FCP':
        rating = value > 1800 ? 'poor' : value > 1800 ? 'needs-improvement' : 'good';
        break;
    }

    const vitalsMetric: WebVitalsMetric = {
      name: metric.name,
      value,
      rating,
      timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[WebVitals] ${metric.name}: ${value} (${rating})`);
    }

    // Send to analytics service (Vercel Analytics, Google Analytics, etc.)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // Send to Google Analytics 4
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: rating,
        value: value,
        custom_map: { metric_value: value },
      });
    }

    // Check for degradation alerts (if worse than threshold)
    checkPerformanceAlerts(vitalsMetric);
  };

  const checkPerformanceAlerts = (metric: WebVitalsMetric) => {
    const thresholds = {
      LCP: 2500, // 2.5s
      FID: 100,  // 100ms
      CLS: 100,  // 0.1
    };

    if (metric.rating === 'poor' && thresholds[metric.name as keyof typeof thresholds] < metric.value) {
      console.warn(`🚨 PERFORMANCE ALERT: ${metric.name} degraded to ${metric.value} (${metric.rating})`);

      // In a real app, this could send notifications to developers
      // via Slack, Discord, email, etc.
    }
  };

  useEffect(() => {
    // Only run in browser and not during server-side rendering
    if (typeof window !== 'undefined') {
      onCLS(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    }
  }, [reportWebVitals]);

  return null; // This component doesn't render anything
}
