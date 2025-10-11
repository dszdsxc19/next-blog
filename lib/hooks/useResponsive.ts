'use client'

import { useState, useEffect } from 'react'
import { TOCPosition, UseResponsiveReturn } from '@/types/toc'

// Tailwind CSS breakpoints
const BREAKPOINTS = {
  mobile: 768, // md breakpoint
  tablet: 1024, // lg breakpoint
}

export const useResponsive = (): UseResponsiveReturn => {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < BREAKPOINTS.mobile
  const isTablet = windowWidth >= BREAKPOINTS.mobile && windowWidth < BREAKPOINTS.tablet
  const isDesktop = windowWidth >= BREAKPOINTS.tablet

  // Determine appropriate TOC position based on screen size
  const getTOCPosition = (): TOCPosition => {
    if (isMobile) return 'top'
    if (isTablet) return 'top'
    return 'sidebar'
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    tocPosition: getTOCPosition(),
  }
}
