'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import type { ActivityData, HeatmapConfig } from './types'

interface ActivityHeatmapProps {
    data: ActivityData[]
    config: HeatmapConfig
    className?: string
}

export function ActivityHeatmap({ data, config, className = '' }: ActivityHeatmapProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const calRef = useRef<any>(null)
    const { theme } = useTheme()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    // Handle day click for navigation
    const handleDayClick = (timestamp: number) => {
        const date = new Date(timestamp * 1000).toISOString().split('T')[0]
        const dayData = data.find(d => d.date === date)

        if (dayData && dayData.posts && dayData.posts.length > 0) {
            setSelectedDate(date)

            // Navigate to first post if only one, otherwise show selection
            if (dayData.posts.length === 1) {
                window.open(`/blog/${dayData.posts[0].slug}`, '_blank')
            }
        }
    }

    useEffect(() => {
        let mounted = true

        const initializeHeatmap = async () => {
            if (!containerRef.current || !data.length) {
                setIsLoading(false)
                return
            }

            try {
                // Dynamic import to avoid SSR issues
                const CalHeatmap = (await import('cal-heatmap')).default
                const Tooltip = (await import('cal-heatmap/plugins/Tooltip')).default
                const Legend = (await import('cal-heatmap/plugins/Legend')).default
                const CalendarLabel = (await import('cal-heatmap/plugins/CalendarLabel')).default

                if (!mounted) return

                // Clear previous instance
                if (calRef.current) {
                    calRef.current.destroy()
                }

                // Convert data to cal-heatmap format
                const heatmapData = data.reduce((acc, item) => {
                    const timestamp = new Date(item.date).getTime() / 1000
                    acc[timestamp] = item.count
                    return acc
                }, {} as Record<number, number>)

                // Calculate date range
                const endDate = new Date()
                const startDate = new Date()
                startDate.setDate(endDate.getDate() - (config.weeksToShow * 7))

                // Color scheme based on theme and config
                const isDark = theme === 'dark'
                const colors = getColorScheme(config.colorScheme, isDark, config.customColors)

                // Initialize cal-heatmap
                const cal = new CalHeatmap()
                calRef.current = cal

                // Responsive configuration
                const isMobile = window.innerWidth < 768
                const isTablet = window.innerWidth < 1024

                const responsiveConfig = {
                    cellSize: isMobile ? 8 : isTablet ? 10 : 11,
                    cellRadius: isMobile ? 1 : 2,
                    cellGutter: isMobile ? 1 : 2,
                    monthsToShow: isMobile ? 6 : isTablet ? 9 : Math.ceil(config.weeksToShow / 4)
                }

                await cal.paint({
                    data: {
                        source: heatmapData,
                        type: 'json'
                    },
                    date: {
                        start: startDate,
                        max: endDate
                    },
                    range: responsiveConfig.monthsToShow, // Responsive months
                    scale: {
                        color: {
                            type: 'threshold',
                            range: colors,
                            domain: [1, 2, 4, 8],
                            scheme: 'BuGn'
                        }
                    },
                    domain: {
                        type: 'month',
                        gutter: 4,
                        label: {
                            text: 'MMM',
                            textAlign: 'start',
                            position: 'top',
                            style: {
                                fontSize: '12px',
                                fill: isDark ? '#9ca3af' : '#6b7280'
                            }
                        }
                    },
                    subDomain: {
                        type: 'ghDay',
                        radius: responsiveConfig.cellRadius,
                        width: responsiveConfig.cellSize,
                        height: responsiveConfig.cellSize,
                        gutter: responsiveConfig.cellGutter,
                        label: {
                            style: {
                                fontSize: '10px',
                                fill: isDark ? '#9ca3af' : '#6b7280'
                            }
                        }
                    },
                    itemSelector: containerRef.current,
                    theme: isDark ? 'dark' : 'light'
                }, [
                    [
                        Tooltip,
                        {
                            text: function (date: any, value: number, dayjsDate: any) {
                                // Convert date to string format for comparison
                                let dateString: string
                                if (date instanceof Date) {
                                    dateString = date.toISOString().split('T')[0]
                                } else if (typeof date === 'string') {
                                    dateString = date.split('T')[0]
                                } else if (typeof date === 'number') {
                                    dateString = new Date(date * 1000).toISOString().split('T')[0]
                                } else {
                                    // Fallback to dayjsDate format
                                    dateString = dayjsDate.format('YYYY-MM-DD')
                                }

                                const dayData = data.find(d => d.date === dateString)
                                if (!dayData || dayData.count === 0) {
                                    return `No posts on ${dayjsDate.format('MMM DD, YYYY')}`
                                }

                                const postText = dayData.count === 1 ? 'post' : 'posts'
                                let tooltip = `${dayData.count} ${postText} on ${dayjsDate.format('MMM DD, YYYY')}`

                                if (dayData.posts && dayData.posts.length > 0) {
                                    tooltip += '\n\nPosts:\n' + dayData.posts.map(p => `• ${p.title}`).join('\n')
                                }

                                return tooltip
                            },
                            style: {
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
                                color: isDark ? '#1f2937' : 'white',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                lineHeight: '1.4',
                                whiteSpace: 'pre-line',
                                zIndex: 1000,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                border: isDark ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)'
                            }
                        }
                    ],
                    [
                        Legend,
                        {
                            anchor: 'bottom',
                            width: 200,
                            itemSelector: '#heatmap-legend',
                            style: {
                                fontSize: '11px',
                                fill: isDark ? '#9ca3af' : '#6b7280'
                            }
                        }
                    ],
                    [
                        CalendarLabel,
                        {
                            width: 30,
                            textAlign: 'start',
                            text: () => ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'],
                            padding: [25, 0, 0, 0],
                            style: {
                                fontSize: '10px',
                                fill: isDark ? '#9ca3af' : '#6b7280'
                            }
                        }
                    ]
                ])

                if (mounted) {
                    setIsLoading(false)
                    setError(null)
                }
            } catch (err) {
                console.error('Failed to initialize heatmap:', err)
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load heatmap')
                    setIsLoading(false)
                }
            }
        }

        initializeHeatmap()

        return () => {
            mounted = false
            if (calRef.current) {
                try {
                    calRef.current.destroy()
                } catch (err) {
                    console.warn('Error destroying heatmap:', err)
                }
            }
        }
    }, [data, config, theme])

    // Handle window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            // Debounce resize events
            const timeoutId = setTimeout(() => {
                if (calRef.current && containerRef.current) {
                    // Reinitialize heatmap with new responsive settings
                    calRef.current.destroy()
                    // Trigger re-render by updating a state
                    setIsLoading(true)
                }
            }, 300)

            return () => clearTimeout(timeoutId)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (error) {
        return (
            <div className={`w-full ${className}`}>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <div className="text-red-700 dark:text-red-400">
                        Failed to load activity heatmap: {error}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full ${className}`}>
            <div className="space-y-4">
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading activity data...</span>
                    </div>
                )}

                <div
                    ref={containerRef}
                    className="min-h-[120px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 md:overflow-x-visible"
                    style={{
                        display: isLoading ? 'none' : 'block',
                        // Ensure proper styling for cal-heatmap
                        '--ch-namespace': 'ch',
                        '--ch-subdomain-bg-color': theme === 'dark' ? '#0d1117' : '#ebedf0',
                        '--ch-subdomain-text-color': theme === 'dark' ? '#f0f6fc' : '#24292f'
                    } as React.CSSProperties}
                />

                {!isLoading && (
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Less</span>
                        <div id="heatmap-legend" className="flex items-center space-x-1"></div>
                        <span>More</span>
                    </div>
                )}

                {selectedDate && (
                    <SelectedDatePosts
                        date={selectedDate}
                        data={data.find(d => d.date === selectedDate)}
                        onClose={() => setSelectedDate(null)}
                    />
                )}
            </div>
        </div>
    )
}

/**
 * Get color scheme based on configuration
 */
function getColorScheme(
    scheme: HeatmapConfig['colorScheme'],
    isDark: boolean,
    customColors?: string[]
): string[] {
    if (scheme === 'custom' && customColors) {
        return customColors
    }

    // GitHub-style colors with better contrast
    if (isDark) {
        return [
            '#0d1117', // No activity (dark background)
            '#0e4429', // Low activity
            '#006d32', // Medium-low activity  
            '#26a641', // Medium-high activity
            '#39d353'  // High activity
        ]
    } else {
        return [
            '#ebedf0', // No activity (light background)
            '#9be9a8', // Low activity
            '#40c463', // Medium-low activity
            '#30a14e', // Medium-high activity
            '#216e39'  // High activity
        ]
    }
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
        day: 'numeric'
    })

    return (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Posts on {formattedDate}
                </h4>
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