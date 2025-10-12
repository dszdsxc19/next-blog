'use client'

import React, { useMemo, useCallback, memo } from 'react'
import { TableOfContentsProps } from '@/types/toc'
import { useScrollSpy } from '@/lib/hooks/useScrollSpy'
import { smoothScrollToElement, calculateScrollOffset } from '@/lib/utils/smoothScroll'

const SkeletonTOC: React.FC<TableOfContentsProps> = memo(
  ({ toc, className = '', minHeadings = 3, maxDepth = 6 }) => {
    const filteredToc = useMemo(() => {
      if (!toc || toc.length < minHeadings) {
        return []
      }

      const depthLimit = Math.min(Math.max(maxDepth, 1), 4)

      return toc
        .filter((item) => item.depth <= depthLimit)
        .filter((item) => item.value && item.value.trim().length > 0)
    }, [toc, minHeadings, maxDepth])

    const headingIds = useMemo(
      () => filteredToc.map((item) => item.url.replace('#', '')),
      [filteredToc]
    )

    const { activeId } = useScrollSpy({ headingIds })

    const handleItemClick = useCallback((id: string) => {
      const offset = calculateScrollOffset()
      smoothScrollToElement(id, offset)
    }, [])

    if (filteredToc.length === 0) {
      return null
    }

    return (
      <nav className={`skeleton-toc ${className}`} aria-label="Table of contents">
        <div className="skeleton-toc-header">
          <span className="skeleton-toc-title">目录</span>
        </div>
        <ul className="skeleton-toc-list">
          {filteredToc.map((item, index) => {
            const id = item.url.replace('#', '')
            const isActive = activeId === id

            return (
              <li
                key={`${item.url}-${index}`}
                className={`skeleton-toc-item skeleton-toc-depth-${item.depth} ${isActive ? 'skeleton-toc-item-active' : ''
                  }`}
              >
                <a
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault()
                    handleItemClick(id)
                  }}
                  className={`skeleton-toc-link ${isActive ? 'skeleton-toc-link-active' : ''}`}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <span className="skeleton-toc-marker" aria-hidden="true" />
                  <span className="skeleton-toc-text">{item.value}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
)

SkeletonTOC.displayName = 'SkeletonTOC'

export default SkeletonTOC
