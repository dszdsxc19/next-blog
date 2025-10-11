'use client'

import React, { memo } from 'react'
import { TOCToggleProps } from '@/types/toc'

const TOCToggle: React.FC<TOCToggleProps> = memo(
  ({ isOpen, onToggle, itemCount, className = '' }) => {
    return (
      <button
        className={`toc-toggle ${className} ${isOpen ? 'toc-toggle-open' : 'toc-toggle-closed'}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="toc-content"
        aria-label={`${isOpen ? 'Hide' : 'Show'} table of contents`}
        type="button"
      >
        <span className="toc-toggle-icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
        <span className="toc-toggle-text">
          Table of Contents ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      </button>
    )
  }
)

TOCToggle.displayName = 'TOCToggle'

export default TOCToggle
