'use client'

import React, { memo, useMemo } from 'react'
import { TOCContentProps } from '@/types/toc'
import TOCItem from './TOCItem'

const TOCContent: React.FC<TOCContentProps> = memo(
  ({ items, activeId, onItemClick, maxDepth, className = '' }) => {
    const memoizedItems = useMemo(() => {
      if (!items || items.length === 0) {
        return []
      }
      return items
    }, [items])

    if (memoizedItems.length === 0) {
      return null
    }

    return (
      <ul className={`toc-content ${className}`} aria-label="Table of contents navigation">
        {memoizedItems.map((item, index) => (
          <TOCItem
            key={`${item.url}-${index}`}
            item={item}
            isActive={activeId === item.url.replace('#', '')}
            onClick={onItemClick}
            className={`toc-depth-${item.depth}`}
          />
        ))}
      </ul>
    )
  }
)

TOCContent.displayName = 'TOCContent'

export default TOCContent
