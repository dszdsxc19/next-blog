'use client'

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { TableOfContentsProps } from '@/types/toc'
import { useResponsive } from '@/lib/hooks/useResponsive'
import { useScrollSpy } from '@/lib/hooks/useScrollSpy'
import { smoothScrollToElement, calculateScrollOffset } from '@/lib/utils/smoothScroll'
import TOCContent from './TOCContent'
import TOCToggle from './TOCToggle'

const TableOfContents: React.FC<TableOfContentsProps> = memo(
  ({
    toc,
    className = '',
    position = 'sidebar',
    minHeadings = 3,
    maxDepth = 6,
    showToggle = false,
    sticky = true,
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { isMobile, isTablet, isDesktop, tocPosition } = useResponsive()

    const handleToggle = useCallback(() => {
      setIsOpen((prev) => !prev)
      // Focus management for accessibility
      if (!isOpen) {
        // When opening, focus will naturally go to the first TOC item
        setTimeout(() => {
          const firstLink = document.querySelector('.toc-link') as HTMLElement
          if (firstLink) {
            firstLink.focus()
          }
        }, 100)
      }
    }, [isOpen])

    // Memoize filtered TOC to prevent unnecessary recalculations
    const filteredToc = useMemo(() => {
      if (!toc || toc.length < minHeadings) {
        return []
      }
      return toc.filter((item) => item.depth <= maxDepth)
    }, [toc, minHeadings, maxDepth])

    // Extract heading IDs for scroll spy
    const headingIds = useMemo(
      () => filteredToc.map((item) => item.url.replace('#', '')),
      [filteredToc]
    )

    // Use scroll spy to track active section
    const { activeId } = useScrollSpy({ headingIds })

    // Handle TOC item click with smooth scrolling
    const handleItemClick = useCallback((id: string) => {
      const offset = calculateScrollOffset()
      smoothScrollToElement(id, offset)
    }, [])

    // Auto-scroll TOC when active item changes (throttled)
    useEffect(() => {
      if (activeId) {
        const timeoutId = setTimeout(() => {
          const activeElement = document.querySelector(`[href="#${activeId}"]`)
          if (activeElement) {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            })
          }
        }, 100)

        return () => clearTimeout(timeoutId)
      }
    }, [activeId])

    // Memoize position and class calculations
    const { finalPosition, positionClass, responsiveClass, shouldShowToggle } = useMemo(() => {
      const finalPos = position === 'auto' ? tocPosition : position

      const positionClasses = {
        sidebar: `toc-sidebar ${sticky ? 'toc-sticky' : ''}`,
        top: 'toc-top',
        floating: `toc-floating ${sticky ? 'toc-sticky' : ''}`,
      }

      const responsiveClasses = {
        mobile: isMobile ? 'toc-mobile' : '',
        tablet: isTablet ? 'toc-tablet' : '',
        desktop: isDesktop ? 'toc-desktop' : '',
      }

      return {
        finalPosition: finalPos,
        positionClass: positionClasses[finalPos] || positionClasses.sidebar,
        responsiveClass: Object.values(responsiveClasses).filter(Boolean).join(' '),
        shouldShowToggle: showToggle || isMobile,
      }
    }, [position, tocPosition, sticky, isMobile, isTablet, isDesktop, showToggle])

    // Don't render if we don't have enough headings
    if (filteredToc.length === 0) {
      return null
    }

    return (
      <nav
        className={`table-of-contents ${positionClass} ${responsiveClass} ${className}`}
        aria-label="Table of contents"
      >
        {shouldShowToggle && (
          <TOCToggle isOpen={isOpen} onToggle={handleToggle} itemCount={filteredToc.length} />
        )}

        <div
          className={`toc-wrapper ${shouldShowToggle && !isOpen ? 'toc-hidden' : 'toc-visible'}`}
          id="toc-content"
        >
          {!shouldShowToggle && <h3 className="toc-title">Table of Contents</h3>}
          <TOCContent
            items={filteredToc}
            activeId={activeId}
            onItemClick={handleItemClick}
            maxDepth={maxDepth}
          />
        </div>
      </nav>
    )
  }
)

TableOfContents.displayName = 'TableOfContents'

export default TableOfContents
