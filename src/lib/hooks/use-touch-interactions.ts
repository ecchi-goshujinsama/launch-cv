'use client';

import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';

export interface TouchGesture {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  duration: number;
  distance: number;
}

export interface SwipeGesture extends TouchGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  velocity: number;
}

export interface TouchHandlers {
  onSwipeLeft?: (gesture: SwipeGesture) => void;
  onSwipeRight?: (gesture: SwipeGesture) => void;
  onSwipeUp?: (gesture: SwipeGesture) => void;
  onSwipeDown?: (gesture: SwipeGesture) => void;
  onTouchStart?: (touch: React.Touch, event: React.TouchEvent) => void;
  onTouchMove?: (gesture: TouchGesture, event: React.TouchEvent) => void;
  onTouchEnd?: (gesture: TouchGesture, event: React.TouchEvent) => void;
}

export interface TouchOptions {
  minSwipeDistance?: number;
  minSwipeVelocity?: number;
  preventScroll?: boolean;
  preventDefault?: boolean;
}

const DEFAULT_OPTIONS: Required<TouchOptions> = {
  minSwipeDistance: 50,
  minSwipeVelocity: 0.3,
  preventScroll: false,
  preventDefault: true
};

export function useTouchInteractions(
  handlers: TouchHandlers,
  options: TouchOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [isTouch, setIsTouch] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number; time: number } | null>(null);
  
  const getTouchGesture = useCallback((
    startX: number, 
    startY: number, 
    currentX: number, 
    currentY: number, 
    startTime: number, 
    currentTime: number
  ): TouchGesture => {
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const duration = currentTime - startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    return {
      startX,
      startY,
      currentX,
      currentY,
      deltaX,
      deltaY,
      duration,
      distance
    };
  }, []);

  const getSwipeDirection = useCallback((deltaX: number, deltaY: number): 'left' | 'right' | 'up' | 'down' => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;

    setIsTouch(true);
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    handlers.onTouchStart?.(touch, event);
  }, [handlers]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = event.touches[0];
    if (!touch) return;

    const currentTime = Date.now();
    touchMoveRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: currentTime
    };

    const gesture = getTouchGesture(
      touchStartRef.current.x,
      touchStartRef.current.y,
      touch.clientX,
      touch.clientY,
      touchStartRef.current.time,
      currentTime
    );

    if (opts.preventScroll && Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) {
      event.preventDefault();
    }

    handlers.onTouchMove?.(gesture, event);
  }, [handlers, getTouchGesture, opts.preventScroll]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = event.changedTouches[0];
    if (!touch) return;

    const endTime = Date.now();
    const gesture = getTouchGesture(
      touchStartRef.current.x,
      touchStartRef.current.y,
      touch.clientX,
      touch.clientY,
      touchStartRef.current.time,
      endTime
    );

    // Check if this qualifies as a swipe
    if (gesture.distance >= opts.minSwipeDistance && gesture.duration > 0) {
      const velocity = gesture.distance / gesture.duration;
      
      if (velocity >= opts.minSwipeVelocity) {
        const direction = getSwipeDirection(gesture.deltaX, gesture.deltaY);
        const swipeGesture: SwipeGesture = {
          ...gesture,
          direction,
          velocity
        };

        switch (direction) {
          case 'left':
            handlers.onSwipeLeft?.(swipeGesture);
            break;
          case 'right':
            handlers.onSwipeRight?.(swipeGesture);
            break;
          case 'up':
            handlers.onSwipeUp?.(swipeGesture);
            break;
          case 'down':
            handlers.onSwipeDown?.(swipeGesture);
            break;
        }
      }
    }

    handlers.onTouchEnd?.(gesture, event);

    // Reset touch state
    touchStartRef.current = null;
    touchMoveRef.current = null;
    setIsTouch(false);
  }, [handlers, getTouchGesture, getSwipeDirection, opts.minSwipeDistance, opts.minSwipeVelocity]);

  // Touch event handlers for React components
  const touchProps = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    style: {
      touchAction: opts.preventScroll ? 'pan-y' : 'auto'
    } as React.CSSProperties
  };

  return {
    isTouch,
    touchProps,
    currentGesture: touchStartRef.current && touchMoveRef.current ? 
      getTouchGesture(
        touchStartRef.current.x,
        touchStartRef.current.y,
        touchMoveRef.current.x,
        touchMoveRef.current.y,
        touchStartRef.current.time,
        touchMoveRef.current.time
      ) : null
  };
}

// Hook for detecting mobile/touch devices
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
      setIsTouchDevice(touch);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { 
    isMobile, 
    isTouchDevice,
    isDesktop: !isMobile && !isTouchDevice
  };
}

// Hook for handling swipe navigation between sections
export function useSwipeNavigation(
  sections: string[], 
  currentSection: string, 
  onSectionChange: (section: string) => void,
  enabled = true
) {
  const currentIndex = sections.indexOf(currentSection);

  const swipeToNext = useCallback(() => {
    if (!enabled || currentIndex >= sections.length - 1) return;
    const nextSection = sections[currentIndex + 1];
    if (nextSection) {
      onSectionChange(nextSection);
    }
  }, [enabled, currentIndex, sections, onSectionChange]);

  const swipeToPrevious = useCallback(() => {
    if (!enabled || currentIndex <= 0) return;
    const previousSection = sections[currentIndex - 1];
    if (previousSection) {
      onSectionChange(previousSection);
    }
  }, [enabled, currentIndex, sections, onSectionChange]);

  const touchHandlers: TouchHandlers = {
    onSwipeLeft: swipeToNext,
    onSwipeRight: swipeToPrevious
  };

  const { touchProps, isTouch } = useTouchInteractions(touchHandlers, {
    minSwipeDistance: 100,
    minSwipeVelocity: 0.5,
    preventScroll: false
  });

  return {
    touchProps,
    isTouch,
    canSwipeNext: currentIndex < sections.length - 1,
    canSwipePrevious: currentIndex > 0,
    swipeToNext,
    swipeToPrevious
  };
}