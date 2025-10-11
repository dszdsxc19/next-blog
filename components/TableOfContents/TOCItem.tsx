'use client'

import React, { memo, useCallback } from 'react'
import { TOCItemProps } from '@/types/toc'

const TOCItem: React.FC<TOCItemProps> = memo(({ item, isActive, onClick, className = '' }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const id = item.url.replace('#', '')
      onClick(id)
    },
    [item.url, onClick]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const id = item.url.replace('#', '')
        onClick(id)
      }
    },
    [item.url, onClick]
  )

  return (
    <li className={`toc-item ${className} ${isActive ? 'toc-item-active' : ''}`}>
      <a
        href={item.url}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`toc-link toc-link-depth-${item.depth} ${isActive ? 'toc-link-active' : ''}`}
        aria-current={isActive ? 'location' : undefined}
        tabIndex={0}
      >
        <span className="toc-text">{item.value}</span>
      </a>
    </li>
  )
})

TOCItem.displayName = 'TOCItem'

export default TOCItem
