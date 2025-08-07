import { lazy, ComponentType } from 'react';

// Lazy loading utility for components
export const createLazyComponent = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  return lazy(factory);
};

// Performance monitoring utilities
export const performanceMonitor = {
  // Mark performance points
  mark: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
    }
  },

  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
    }
  },

  // Get performance entries
  getEntries: (type?: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      return type 
        ? performance.getEntriesByType(type)
        : performance.getEntries();
    }
    return [];
  },

  // Log performance metrics to console (development only)
  logMetrics: () => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const navigationEntries = performance.getEntriesByType('navigation');
      const navigation = navigationEntries[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        console.group('🚀 LaunchCV Performance Metrics');
        console.log('DNS Lookup:', `${Math.round(navigation.domainLookupEnd - navigation.domainLookupStart)}ms`);
        console.log('TCP Connection:', `${Math.round(navigation.connectEnd - navigation.connectStart)}ms`);
        console.log('Request Time:', `${Math.round(navigation.responseEnd - navigation.requestStart)}ms`);
        console.log('DOM Content Loaded:', `${Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart)}ms`);
        console.log('Page Load Complete:', `${Math.round(navigation.loadEventEnd - navigation.navigationStart)}ms`);
        console.log('First Contentful Paint:', this.getFCP());
        console.log('Largest Contentful Paint:', this.getLCP());
        console.groupEnd();
      }
    }
  },

  // Get First Contentful Paint
  getFCP: () => {
    const entries = performance.getEntriesByType('paint') as PerformancePaintTiming[];
    const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? `${Math.round(fcp.startTime)}ms` : 'N/A';
  },

  // Get Largest Contentful Paint
  getLCP: () => {
    return new Promise<string>((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          resolve(`${Math.round(lastEntry.startTime)}ms`);
          observer.disconnect();
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve('N/A');
        }, 5000);
      } else {
        resolve('N/A');
      }
    });
  },

  // Monitor bundle size
  estimateBundleSize: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const totalSize = resourceEntries
        .filter(entry => entry.name.includes('.js') || entry.name.includes('.css'))
        .reduce((total, entry) => total + (entry.transferSize || 0), 0);
      
      return {
        totalBytes: totalSize,
        totalKB: Math.round(totalSize / 1024),
        compressed: Math.round(totalSize / 1024) + 'KB',
      };
    }
    return null;
  },
};

// Image optimization utilities
export const imageUtils = {
  // Preload critical images
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  // Lazy load images with intersection observer
  createLazyImageLoader: () => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return null;
    }

    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01,
    });
  },

  // Generate responsive image srcSet
  generateSrcSet: (baseSrc: string, sizes: number[] = [320, 640, 960, 1280]) => {
    return sizes
      .map(size => {
        const extension = baseSrc.split('.').pop();
        const baseName = baseSrc.replace(`.${extension}`, '');
        return `${baseName}-${size}w.${extension} ${size}w`;
      })
      .join(', ');
  },
};

// Memory management utilities
export const memoryUtils = {
  // Estimate memory usage
  getMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
      };
    }
    return null;
  },

  // Clean up unused resources
  cleanup: () => {
    // Force garbage collection in development
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      if ('gc' in window) {
        (window as any).gc();
      }
    }
  },
};

// Bundle analysis utilities
export const bundleAnalyzer = {
  // Analyze loaded modules (development only)
  analyzeModules: () => {
    if (process.env.NODE_ENV === 'development') {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const jsFiles = resources.filter(r => r.name.endsWith('.js'));
      const cssFiles = resources.filter(r => r.name.endsWith('.css'));
      
      console.group('📦 Bundle Analysis');
      console.log('JavaScript Files:', jsFiles.length);
      console.log('CSS Files:', cssFiles.length);
      console.log('Total JS Size:', jsFiles.reduce((sum, f) => sum + (f.transferSize || 0), 0) / 1024 + 'KB');
      console.log('Total CSS Size:', cssFiles.reduce((sum, f) => sum + (f.transferSize || 0), 0) / 1024 + 'KB');
      console.groupEnd();
      
      return {
        js: jsFiles,
        css: cssFiles,
        totalSize: [...jsFiles, ...cssFiles].reduce((sum, f) => sum + (f.transferSize || 0), 0),
      };
    }
    return null;
  },

  // Check if bundle size is within target
  checkBundleSize: (targetKB = 200) => {
    const analysis = bundleAnalyzer.analyzeModules();
    if (analysis) {
      const sizeKB = analysis.totalSize / 1024;
      return {
        sizeKB: Math.round(sizeKB),
        withinTarget: sizeKB <= targetKB,
        target: targetKB,
        message: sizeKB <= targetKB 
          ? `✅ Bundle size (${Math.round(sizeKB)}KB) is within target (${targetKB}KB)`
          : `⚠️ Bundle size (${Math.round(sizeKB)}KB) exceeds target (${targetKB}KB)`
      };
    }
    return null;
  },
};

// Performance optimization hooks
export const usePerformanceMonitoring = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Log performance metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.logMetrics();
        bundleAnalyzer.checkBundleSize();
      }, 1000);
    });
  }
};

// Critical resource hints
export const resourceHints = {
  // Preload critical resources
  preload: (href: string, as: 'script' | 'style' | 'font' | 'image', crossorigin?: boolean) => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (crossorigin) link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  },

  // Prefetch resources for next navigation
  prefetch: (href: string) => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  },

  // DNS prefetch for external domains
  dnsPrefetch: (domain: string) => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    }
  },
};