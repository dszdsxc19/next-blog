'use client'

import React, { useState, useMemo, useRef } from 'react'
import { useTheme } from 'next-themes'
import type { ActivityData, HeatmapConfig } from './types'

interface Post {
  title: string
  slug: string
}

interface CellData {
  date: string
  count: number
  posts: Post[]
}

interface ActivityHeatmapProps {
  data: ActivityData[]
  config: HeatmapConfig
  className?: string
}

export function ActivityHeatmap({ data, config, className = '' }: ActivityHeatmapProps) {
  const { theme } = useTheme()
  const [hoveredCell, setHoveredCell] = useState<CellData | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate calendar grid data
  const calendarData = useMemo(() => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - (config.weeksToShow * 7 - 1))

    // Start from Sunday of the week containing startDate
    const firstSunday = new Date(startDate)
    firstSunday.setDate(startDate.getDate() - startDate.getDay())

    const weeks: CellData[][] = []
    const dataMap = new Map(data.map((d) => [d.date, d]))

    const currentDate = new Date(firstSunday)

    for (let week = 0; week < config.weeksToShow; week++) {
      const weekData: CellData[] = []

      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const dayData = dataMap.get(dateStr)

        weekData.push({
          date: dateStr,
          count: dayData?.count || 0,
          posts: dayData?.posts || [],
        })

        currentDate.setDate(currentDate.getDate() + 1)
      }

      weeks.push(weekData)
    }

    return weeks
  }, [data, config.weeksToShow])

  // Get color for activity level
  const getActivityColor = (count: number) => {
    const isDark = theme === 'dark'

    if (count === 0) {
      return isDark ? '#161b22' : '#ebedf0'
    }

    // GitHub-style color intensity
    if (isDark) {
      if (count >= 4) return '#39d353'
      if (count >= 3) return '#26a641'
      if (count >= 2) return '#006d32'
      return '#0e4429'
    } else {
      if (count >= 4) return '#216e39'
      if (count >= 3) return '#30a14e'
      if (count >= 2) return '#40c463'
      return '#9be9a8'
    }
  }

  // Handle cell click
  const handleCellClick = (cellData: CellData) => {
    if (cellData.count > 0 && cellData.posts && cellData.posts.length > 0) {
      if (cellData.posts.length === 1) {
        window.open(`/blog/${cellData.posts[0].slug}`, '_blank')
      } else {
        setSelectedDate(cellData.date)
      }
    }
  }

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (event: React.MouseEvent, cellData: CellData) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }
    setHoveredCell(cellData)
  }

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; weekIndex: number }> = []
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    calendarData.forEach((week, weekIndex) => {
      const firstDay = new Date(week[0].date)

      // Check if this week contains the first day of a month
      if (firstDay.getDate() <= 7 || weekIndex === 0) {
        labels.push({
          month: months[firstDay.getMonth()],
          weekIndex,
        })
      }
    })

    return labels
  }, [calendarData])

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      <div className="relative">
        {/* Month labels */}
        <div className="mb-2 flex text-xs text-gray-600 dark:text-gray-400">
          {monthLabels.map((label, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                marginLeft:
                  index === 0
                    ? `${label.weekIndex * 15 + 30}px`
                    : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0)) * 15}px`,
              }}
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex">
          {/* Day labels */}
          <div className="mr-2 flex flex-col text-xs text-gray-600 dark:text-gray-400">
            <div className="h-3 leading-3"></div>
            <div className="h-3 leading-3">Sun</div>
            <div className="h-3 leading-3"></div>
            <div className="h-3 leading-3">Tue</div>
            <div className="h-3 leading-3"></div>
            <div className="h-3 leading-3">Thu</div>
            <div className="h-3 leading-3"></div>
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => {
                  const isToday = day.date === new Date().toISOString().split('T')[0]
                  const hasActivity = day.count > 0

                  return (
                    <button
                      key={day.date}
                      type="button"
                      className={`h-3 w-3 cursor-pointer rounded-sm transition-all duration-200 ${hasActivity
                        ? 'hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500'
                        : ''
                        } ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                      style={{
                        backgroundColor: getActivityColor(day.count),
                      }}
                      onMouseMove={(e) => handleMouseMove(e, day)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => handleCellClick(day)}
                      title={`${day.count} posts on ${new Date(day.date).toLocaleDateString()}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: getActivityColor(level) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div
            className="pointer-events-none absolute z-50"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: 'translateY(-100%)',
            }}
          >
            <div className="rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-100 dark:text-gray-900">
              <div className="font-medium">
                {hoveredCell.count === 0
                  ? 'No posts'
                  : `${hoveredCell.count} post${hoveredCell.count > 1 ? 's' : ''}`}
              </div>
              <div className="text-gray-300 dark:text-gray-600">
                {new Date(hoveredCell.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              {hoveredCell.posts && hoveredCell.posts.length > 0 && (
                <div className="mt-1 max-w-xs">
                  {hoveredCell.posts.slice(0, 3).map((post, index) => (
                    <div key={index} className="truncate text-gray-300 dark:text-gray-600">
                      • {post.title}
                    </div>
                  ))}
                  {hoveredCell.posts.length > 3 && (
                    <div className="text-gray-400 dark:text-gray-500">
                      +{hoveredCell.posts.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected date posts modal */}
        {selectedDate && (
          <SelectedDatePosts
            date={selectedDate}
            data={data.find((d) => d.date === selectedDate)}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Component to show posts for a selected date
 */
interface SelectedDatePostsProps {
  date: string
  data?: ActivityData
  onClose: () => void
}

function SelectedDatePosts({ date, data, onClose }: SelectedDatePostsProps) {
  if (!data || !data.posts || data.posts.length <= 1) {
    return null
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">Posts on {formattedDate}</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {data.posts.map((post, index) => (
          <a
            key={index}
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded p-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            {post.title}
          </a>
        ))}
      </div>
    </div>
  )
}

export default ActivityHeatmap
