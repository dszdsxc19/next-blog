'use client'

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { TableOfContentsProps } from '@/types/toc'
import { useScrollSpy } from '@/lib/hooks/useScrollSpy'
import { smoothScrollToElement, calculateScrollOffset } from '@/lib/utils/smoothScroll'

const SkeletonTOC: React.FC<TableOfContentsProps> = memo(
  ({ toc, className = '', minHeadings = 3, maxDepth = 6 }) => {
    const [isHovered, setIsHovered] = useState(false)

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

    // Don't render if we don't have enough headings
    if (filteredToc.length === 0) {
      return null
    }

    return (
      <nav
        className={`skeleton-toc ${className}`}
        aria-label="Table of contents"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="skeleton-toc-container">
          {isHovered ? (
            <div className="skeleton-toc-expanded">
              <h3 className="skeleton-toc-title">Contents</h3>
              <ul className="skeleton-toc-list">
                {filteredToc.map((item, index) => {
                  const id = item.url.replace('#', '')
                  const isActive = activeId === id

                  return (
                    <li
                      key={`${item.url}-${index}`}
                      className={`skeleton-toc-item skeleton-toc-depth-${item.depth} ${
                        isActive ? 'skeleton-toc-item-active' : ''
                      }`}
                    >
                      <a
                        href={item.url}
                        onClick={(e) => {
                          e.preventDefault()
                          handleItemClick(id)
                        }}
                        className={`skeleton-toc-link ${
                          isActive ? 'skeleton-toc-link-active' : ''
                        }`}
                        aria-current={isActive ? 'location' : undefined}
                      >
                        <span className="skeleton-toc-text">{item.value}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            // Skeleton state
            <div className="skeleton-toc-skeleton">
              <div className="skeleton-toc-lines">
                {filteredToc.slice(0, Math.min(4, filteredToc.length)).map((item, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className={`skeleton-toc-line skeleton-toc-line-depth-${item.depth}`}
                    style={{
                      width: `${Math.max(30, Math.min(80, item.value.length * 1.2))}%`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                ))}
                {filteredToc.length > 4 && (
                  <div className="skeleton-toc-more">+{filteredToc.length - 4} more</div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }
)

SkeletonTOC.displayName = 'SkeletonTOC'

export default SkeletonTOC
