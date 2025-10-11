/**
 * Check if user prefers reduced motion
 */
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Smooth scroll to an element with proper offset calculation
 */
export const smoothScrollToElement = (
  elementId: string,
  offset: number = 80,
  duration: number = 800
): void => {
  const element = document.getElementById(elementId)
  if (!element) return

  const targetPosition = element.offsetTop - offset

  // If user prefers reduced motion, scroll instantly
  if (prefersReducedMotion()) {
    window.scrollTo(0, targetPosition)
    return
  }

  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const ease = easeInOutCubic(progress)

    window.scrollTo(0, startPosition + distance * ease)

    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }

  // Check if browser supports smooth scrolling
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    })
  } else {
    // Fallback for browsers that don't support smooth scrolling
    requestAnimationFrame(animation)
  }
}

/**
 * Calculate offset for sticky headers
 */
export const calculateScrollOffset = (): number => {
  // Check for common sticky header selectors
  const stickySelectors = [
    'header[class*="sticky"]',
    '.sticky-header',
    '[class*="fixed-top"]',
    'nav[class*="fixed"]',
  ]

  let offset = 80 // Default offset

  for (const selector of stickySelectors) {
    const stickyElement = document.querySelector(selector) as HTMLElement
    if (stickyElement) {
      const rect = stickyElement.getBoundingClientRect()
      if (rect.top === 0) {
        // Element is likely sticky/fixed at top
        offset = Math.max(offset, rect.height + 20)
      }
    }
  }

  return offset
}
