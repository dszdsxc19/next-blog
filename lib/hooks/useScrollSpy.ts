'use client'

import { useState, useEffect } from 'react'
import { UseScrollSpyOptions, UseScrollSpyReturn } from '@/types/toc'

export const useScrollSpy = ({
  headingIds,
  rootMargin = '-20% 0px -35% 0px',
  threshold = 0,
}: UseScrollSpyOptions): UseScrollSpyReturn => {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!headingIds.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all visible entries
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          // Sort by position in viewport (topmost first)
          visibleEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top
          })

          // Set the topmost visible heading as active
          const topEntry = visibleEntries[0]
          const id = topEntry.target.id
          setActiveId(id)
        } else {
          // If no headings are visible, find the closest one above the viewport
          const allHeadings = headingIds
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[]

          const headingsAbove = allHeadings.filter((heading) => {
            const rect = heading.getBoundingClientRect()
            return rect.top < window.innerHeight * 0.2 // Above the top margin
          })

          if (headingsAbove.length > 0) {
            // Get the last heading that's above the viewport
            const lastHeadingAbove = headingsAbove[headingsAbove.length - 1]
            setActiveId(lastHeadingAbove.id)
          }
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    // Observe all headings
    headingIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headingIds, rootMargin, threshold])

  return { activeId }
}
