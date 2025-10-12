import { useEffect, useRef, useState, RefObject } from 'react'

/**
 * State representing the visibility and positioning of the Table of Contents
 */
export interface ScrollTOCVisibilityState {
  /** Whether the "Back to blog" link is currently visible in the viewport */
  isBackLinkVisible: boolean
  /** Whether the TOC should be displayed (opposite of isBackLinkVisible) */
  shouldShowTOC: boolean
  /** Whether the TOC should use sticky positioning */
  isSticky: boolean
}

/**
 * Return type for the useScrollTOCVisibility hook
 */
export interface UseScrollTOCVisibilityReturn {
  /** Ref to attach to the "Back to blog" link container */
  backLinkRef: RefObject<HTMLDivElement>
  /** Current state of TOC visibility and positioning */
  tocState: ScrollTOCVisibilityState
}

/**
 * Custom hook for managing scroll-based Table of Contents visibility.
 *
 * This hook uses the Intersection Observer API to detect when the "Back to blog" link
 * enters or exits the viewport, automatically showing/hiding the TOC accordingly.
 *
 * @param enabled - Whether the scroll-based visibility feature is enabled
 * @returns Object containing the backLinkRef and tocState
 *
 * @example
 * ```tsx
 * const { backLinkRef, tocState } = useScrollTOCVisibility(showToc)
 *
 * return (
 *   <>
 *     <div ref={backLinkRef}>
 *       <Link href="/blog">Back to blog</Link>
 *     </div>
 *     <div className={tocState.shouldShowTOC ? 'visible' : 'hidden'}>
 *       <TOC />
 *     </div>
 *   </>
 * )
 * ```
 */
export function useScrollTOCVisibility(enabled: boolean = true): UseScrollTOCVisibilityReturn {
  const backLinkRef = useRef<HTMLDivElement>(null)
  const [isBackLinkVisible, setIsBackLinkVisible] = useState(true)

  useEffect(() => {
    // Early return if feature is disabled or ref is not attached
    if (!enabled || !backLinkRef.current) {
      return
    }

    // Check for Intersection Observer support
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver not supported in this browser. TOC will remain visible.')
      // Fallback: Keep TOC visible and sticky
      setIsBackLinkVisible(false)
      return
    }

    const targetElement = backLinkRef.current

    // Create Intersection Observer to track "Back to blog" link visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Update state when intersection changes
          setIsBackLinkVisible(entry.isIntersecting)
        })
      },
      {
        // Trigger callback as soon as any part enters/exits viewport
        threshold: 0,
        // No margin adjustment needed
        rootMargin: '0px',
      }
    )

    // Start observing the back link element
    observer.observe(targetElement)

    // Cleanup: Disconnect observer when component unmounts or dependencies change
    return () => {
      observer.disconnect()
    }
  }, [enabled])

  return {
    backLinkRef,
    tocState: {
      isBackLinkVisible,
      // TOC should be shown when back link is not visible
      shouldShowTOC: !isBackLinkVisible,
      // TOC should be sticky when it's shown
      isSticky: !isBackLinkVisible,
    },
  }
}
