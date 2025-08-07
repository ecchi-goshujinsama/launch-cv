'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LivePreview } from './live-preview';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { useIsMobile } from '@/lib/hooks/use-touch-interactions';

interface PreviewContainerProps {
  className?: string;
  showControls?: boolean;
  autoScale?: boolean;
  initialPreviewMode?: 'desktop' | 'tablet' | 'mobile';
}

export function PreviewContainer({
  className,
  showControls = true,
  autoScale = true,
  initialPreviewMode = 'desktop'
}: PreviewContainerProps) {
  const [previewMode, setPreviewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>(initialPreviewMode);
  const [containerRef, setContainerRef] = React.useState<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(1);

  // Responsive breakpoints and device detection
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const { isMobile: isReallyMobile, isTouchDevice } = useIsMobile();

  // Auto-adjust preview mode based on screen size and device capabilities
  React.useEffect(() => {
    if (isReallyMobile && previewMode === 'desktop') {
      setPreviewMode('mobile');
    } else if (isTablet && !isReallyMobile && previewMode === 'desktop') {
      setPreviewMode('tablet');
    }
  }, [isReallyMobile, isTablet, previewMode]);

  // Calculate optimal scale for container
  React.useEffect(() => {
    if (!autoScale || !containerRef) return;

    const updateScale = () => {
      const container = containerRef;
      const containerWidth = container.clientWidth - 32; // Account for padding
      const containerHeight = container.clientHeight - 100; // Account for controls and padding

      // Standard US Letter size (8.5 x 11 inches) at 96 DPI
      const pageWidth = 816; // 8.5 * 96
      const pageHeight = 1056; // 11 * 96

      let targetWidth = pageWidth;
      let targetHeight = pageHeight;

      // Adjust target size based on preview mode and device capabilities
      switch (previewMode) {
        case 'mobile':
          targetWidth = isTouchDevice ? Math.min(375, containerWidth) : 375;
          targetHeight = Math.min(targetWidth * (pageHeight / pageWidth), containerHeight);
          break;
        case 'tablet':
          targetWidth = isTouchDevice ? Math.min(768, containerWidth) : 768;
          targetHeight = Math.min(targetWidth * (pageHeight / pageWidth), containerHeight);
          break;
        case 'desktop':
        default:
          // Keep original dimensions but scale to fit
          // On mobile devices, limit the max width to screen width
          if (isReallyMobile) {
            targetWidth = Math.min(pageWidth, containerWidth);
          }
          break;
      }

      const scaleX = containerWidth / targetWidth;
      const scaleY = containerHeight / targetHeight;
      const optimalScale = Math.min(scaleX, scaleY, 1); // Don't scale above 100%

      setScale(Math.max(optimalScale, 0.3)); // Minimum 30% scale
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(containerRef);

    return () => {
      resizeObserver.disconnect();
    };
  }, [autoScale, containerRef, previewMode, isReallyMobile, isTouchDevice]);

  return (
    <div 
      ref={setContainerRef}
      className={cn(
        "flex flex-col h-full bg-gray-50 overflow-hidden",
        isReallyMobile && "mobile-scroll",
        className
      )}
    >
      <LivePreview
        showControls={showControls}
        initialScale={autoScale ? scale : 1}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        className="flex-1"
        isMobile={isReallyMobile}
        isTouchDevice={isTouchDevice}
      />
    </div>
  );
}