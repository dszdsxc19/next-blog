'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import type { TagData, TreemapConfig } from './types'

interface TagTreemapProps {
  data: TagData[]
  config: TreemapConfig
  className?: string
}

export function TagTreemap({ data, config, className = '' }: TagTreemapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentLevel, setCurrentLevel] = useState<TagData[]>(data)
  const [breadcrumb, setBreadcrumb] = useState<string[]>([])

  useEffect(() => {
    let mounted = true

    const initializeTreemap = async () => {
      if (!containerRef.current || !currentLevel.length) {
        setIsLoading(false)
        return
      }

      try {
        if (!mounted) return

        // Clear previous content
        containerRef.current.innerHTML = ''

        // Prepare data for treemap
        const treemapData = prepareTreemapData(currentLevel)

        // Color scheme based on theme
        const isDark = theme === 'dark'

        // Create simple HTML-based treemap
        const treemapElement = createSimpleTreemap(treemapData, {
          width: containerRef.current.clientWidth || 600,
          height: 400,
          isDark,
          onTagClick: (tagData: TagData) => {
            if (tagData.children && tagData.children.length > 0) {
              setCurrentLevel(tagData.children)
              setBreadcrumb([...breadcrumb, tagData.name])
            } else if (config.linkToTagPages) {
              window.open(`/tags/${encodeURIComponent(tagData.name.toLowerCase())}`, '_blank')
            }
          },
        })

        containerRef.current.appendChild(treemapElement)

        if (mounted) {
          setIsLoading(false)
          setError(null)
        }
      } catch (err) {
        console.error('Failed to initialize treemap:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load treemap')
          setIsLoading(false)
        }
      }
    }

    initializeTreemap()

    return () => {
      mounted = false
    }
  }, [currentLevel, config, theme, breadcrumb])

  // Handle zoom out
  const zoomOut = (index: number) => {
    if (index === -1) {
      setCurrentLevel(data)
      setBreadcrumb([])
    } else {
      let currentData = data
      for (let i = 0; i <= index; i++) {
        const categoryName = breadcrumb[i]
        const category = currentData.find((item) => item.name === categoryName)
        if (category && category.children) {
          currentData = category.children
        }
      }
      setCurrentLevel(currentData)
      setBreadcrumb(breadcrumb.slice(0, index + 1))
    }
  }

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="text-red-700 dark:text-red-400">Failed to load tag treemap: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-4">
        {/* Breadcrumb navigation */}
        {breadcrumb.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <button
              onClick={() => zoomOut(-1)}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              All Tags
            </button>
            {breadcrumb.map((crumb, index) => (
              <React.Fragment key={index}>
                <span>/</span>
                <button
                  onClick={() => zoomOut(index)}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {crumb}
                </button>
              </React.Fragment>
            ))}
          </nav>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Loading tag data...
            </span>
          </div>
        )}

        <div
          ref={containerRef}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
          style={{ display: isLoading ? 'none' : 'block' }}
        />

        {/* Legend */}
        {!isLoading && currentLevel.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>
              Click on categories to zoom in • Hover for details • {currentLevel.length}{' '}
              {currentLevel.length === 1 ? 'tag' : 'tags'} shown
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Prepare data for treemap visualization using simple rectangle packing
 */
function prepareTreemapData(data: TagData[]): Array<{
  name: string
  count: number
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  originalData: TagData
}> {
  const sortedData = [...data].sort((a, b) => b.count - a.count)

  const width = 600
  const height = 400
  const padding = 2

  const totalCount = sortedData.reduce((sum, item) => sum + item.count, 0)
  const result: Array<{
    name: string
    count: number
    x1: number
    y1: number
    x2: number
    y2: number
    color: string
    originalData: TagData
  }> = []

  let currentX = 0
  let currentY = 0
  let rowHeight = 0
  let remainingWidth = width

  sortedData.forEach((item, index) => {
    const area = (item.count / totalCount) * (width * height)
    const itemWidth = Math.min(remainingWidth, Math.sqrt(area * (width / height)))
    const itemHeight = area / itemWidth

    if (currentX + itemWidth > width || index === 0) {
      if (index > 0) {
        currentY += rowHeight + padding
        currentX = 0
        remainingWidth = width
        rowHeight = 0
      }
    }

    result.push({
      name: item.name,
      count: item.count,
      x1: currentX,
      y1: currentY,
      x2: currentX + itemWidth - padding,
      y2: currentY + itemHeight - padding,
      color: item.color || generateTagColor(item.name, item.count, false),
      originalData: item,
    })

    currentX += itemWidth
    remainingWidth -= itemWidth
    rowHeight = Math.max(rowHeight, itemHeight)
  })

  return result
}

/**
 * Create a simple HTML-based treemap
 */
function createSimpleTreemap(
  data: Array<{
    name: string
    count: number
    x1: number
    y1: number
    x2: number
    y2: number
    color: string
    originalData: TagData
  }>,
  options: {
    width: number
    height: number
    isDark: boolean
    onTagClick: (tagData: TagData) => void
  }
) {
  const container = document.createElement('div')
  container.style.width = `${options.width}px`
  container.style.height = `${options.height}px`
  container.style.position = 'relative'
  container.style.backgroundColor = options.isDark ? '#1f2937' : '#ffffff'
  container.style.border = `1px solid ${options.isDark ? '#374151' : '#e5e7eb'}`
  container.style.borderRadius = '8px'
  container.style.overflow = 'hidden'

  data.forEach((item) => {
    const rect = document.createElement('div')
    rect.style.position = 'absolute'
    rect.style.left = `${item.x1}px`
    rect.style.top = `${item.y1}px`
    rect.style.width = `${item.x2 - item.x1}px`
    rect.style.height = `${item.y2 - item.y1}px`
    rect.style.backgroundColor = item.color
    rect.style.border = `1px solid ${options.isDark ? '#374151' : '#e5e7eb'}`
    rect.style.cursor = 'pointer'
    rect.style.display = 'flex'
    rect.style.alignItems = 'center'
    rect.style.justifyContent = 'center'
    rect.style.transition = 'all 0.2s ease'
    rect.title = `${item.name}: ${item.count} posts`

    const width = item.x2 - item.x1
    const height = item.y2 - item.y1
    if (width > 60 && height > 30) {
      const text = document.createElement('span')
      text.textContent = item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name
      text.style.color = options.isDark ? '#f9fafb' : '#111827'
      text.style.fontSize = `${Math.max(10, Math.min(14, Math.sqrt(width * height) / 10))}px`
      text.style.fontWeight = '500'
      text.style.textAlign = 'center'
      text.style.pointerEvents = 'none'
      rect.appendChild(text)
    }

    rect.addEventListener('mouseenter', () => {
      rect.style.opacity = '0.8'
      rect.style.transform = 'scale(1.02)'
    })

    rect.addEventListener('mouseleave', () => {
      rect.style.opacity = '1'
      rect.style.transform = 'scale(1)'
    })

    rect.addEventListener('click', () => {
      options.onTagClick(item.originalData)
    })

    container.appendChild(rect)
  })

  return container
}

/**
 * Generate color for a tag based on its name with theme support
 */
function generateTagColor(name: string, count: number, isDark: boolean = false): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = Math.abs(hash) % 360

  let saturation: number
  let lightness: number

  if (isDark) {
    saturation = 60 + (count % 25)
    lightness = 45 + (count % 15)
  } else {
    saturation = 50 + (count % 30)
    lightness = 40 + (count % 25)
  }

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export default TagTreemap
