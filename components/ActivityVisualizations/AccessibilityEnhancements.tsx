'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { ActivityData, TagData } from './types'

interface AccessibilityEnhancementsProps {
    activityData: ActivityData[]
    tagData: TagData[]
    children: React.ReactNode
}

export function AccessibilityEnhancements({
    activityData,
    tagData,
    children
}: AccessibilityEnhancementsProps) {
    const [announcements, setAnnouncements] = useState<string[]>([])
    const [showTextAlternative, setShowTextAlternative] = useState(false)
    const [highContrast, setHighContrast] = useState(false)
    const announcementRef = useRef<HTMLDivElement>(null)

    // Check for user preferences
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches

        setHighContrast(prefersHighContrast)

        // Announce when visualizations are loaded
        if (activityData.length > 0 || tagData.length > 0) {
            announce('Activity visualizations have been loaded and are ready for interaction')
        }
    }, [activityData, tagData])

    const announce = (message: string) => {
        setAnnouncements(prev => [...prev, message])

        // Clear announcement after it's been read
        setTimeout(() => {
            setAnnouncements(prev => prev.slice(1))
        }, 3000)
    }

    return (
        <div className={`visualization-accessibility-wrapper ${highContrast ? 'high-contrast' : ''}`}>
            {/* Screen Reader Announcements */}
            <div
                ref={announcementRef}
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
            >
                {announcements.map((announcement, index) => (
                    <div key={index}>{announcement}</div>
                ))}
            </div>

            {/* Accessibility Controls */}
            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setShowTextAlternative(!showTextAlternative)}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-pressed={showTextAlternative}
                >
                    {showTextAlternative ? 'Hide' : 'Show'} Text Alternative
                </button>

                <button
                    onClick={() => setHighContrast(!highContrast)}
                    className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-pressed={highContrast}
                >
                    {highContrast ? 'Disable' : 'Enable'} High Contrast
                </button>
            </div>

            {/* Text Alternative */}
            {showTextAlternative && (
                <TextAlternative activityData={activityData} tagData={tagData} />
            )}

            {/* Main Visualizations */}
            <div
                className="visualization-main"
                role="img"
                aria-label="Activity and content visualizations"
                aria-describedby="viz-description"
            >
                {children}
            </div>

            {/* Hidden Description for Screen Readers */}
            <div id="viz-description" className="sr-only">
                <ActivityDescription activityData={activityData} />
                <TagDescription tagData={tagData} />
            </div>
        </div>
    )
}

/**
 * Text-based alternative to visualizations
 */
function TextAlternative({ activityData, tagData }: { activityData: ActivityData[], tagData: TagData[] }) {
    const totalPosts = activityData.reduce((sum, day) => sum + day.count, 0)
    const activeDays = activityData.filter(day => day.count > 0).length
    const maxPostsInDay = Math.max(...activityData.map(day => day.count), 0)

    const topTags = tagData
        .filter(tag => !tag.children || tag.children.length === 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Text Summary of Visualizations</h3>

            <div className="space-y-4">
                <section>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Activity Summary</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>Total posts: {totalPosts}</li>
                        <li>Active days: {activeDays}</li>
                        <li>Maximum posts in a single day: {maxPostsInDay}</li>
                        <li>Average posts per active day: {activeDays > 0 ? (totalPosts / activeDays).toFixed(1) : 0}</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Top Content Topics</h4>
                    <ol className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {topTags.map((tag, index) => (
                            <li key={tag.name}>
                                {index + 1}. {tag.name}: {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                            </li>
                        ))}
                    </ol>
                </section>

                <section>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Recent Activity</h4>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {activityData
                            .filter(day => day.count > 0)
                            .slice(-5)
                            .reverse()
                            .map(day => (
                                <div key={day.date} className="mb-1">
                                    {new Date(day.date).toLocaleDateString()}: {day.count} {day.count === 1 ? 'post' : 'posts'}
                                    {day.posts && day.posts.length > 0 && (
                                        <ul className="ml-4 mt-1">
                                            {day.posts.map(post => (
                                                <li key={post.slug}>• {post.title}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

/**
 * Screen reader description for activity data
 */
function ActivityDescription({ activityData }: { activityData: ActivityData[] }) {
    const totalPosts = activityData.reduce((sum, day) => sum + day.count, 0)
    const activeDays = activityData.filter(day => day.count > 0).length

    return (
        <div>
            <h3>Activity Heatmap Description</h3>
            <p>
                This visualization shows a calendar-style heatmap of blog posting activity.
                There are {totalPosts} total posts across {activeDays} active days.
                Darker colors indicate days with more posts. You can hover over individual days
                to see specific post counts and titles.
            </p>
        </div>
    )
}

/**
 * Screen reader description for tag data
 */
function TagDescription({ tagData }: { tagData: TagData[] }) {
    const totalTags = tagData.length
    const topTag = tagData.reduce((max, tag) => tag.count > max.count ? tag : max, { name: '', count: 0 })

    return (
        <div>
            <h3>Tag Treemap Description</h3>
            <p>
                This visualization shows content topics as a treemap where rectangle sizes
                represent the number of posts for each tag. There are {totalTags} different topics.
                The most frequent topic is "{topTag.name}" with {topTag.count} posts.
                You can click on categories to zoom in and explore subcategories.
            </p>
        </div>
    )
}

/**
 * Keyboard navigation enhancement
 */
export function KeyboardNavigationEnhancement({ children }: { children: React.ReactNode }) {
    const [focusedElement, setFocusedElement] = useState<string | null>(null)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Handle keyboard shortcuts for visualization navigation
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'h':
                        event.preventDefault()
                        // Focus on heatmap
                        const heatmap = document.querySelector('[data-visualization="heatmap"]') as HTMLElement
                        if (heatmap) {
                            heatmap.focus()
                            setFocusedElement('heatmap')
                        }
                        break
                    case 't':
                        event.preventDefault()
                        // Focus on treemap
                        const treemap = document.querySelector('[data-visualization="treemap"]') as HTMLElement
                        if (treemap) {
                            treemap.focus()
                            setFocusedElement('treemap')
                        }
                        break
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div>
            {/* Keyboard shortcuts help */}
            <div className="sr-only">
                <h3>Keyboard Shortcuts</h3>
                <ul>
                    <li>Ctrl+H (or Cmd+H): Focus on activity heatmap</li>
                    <li>Ctrl+T (or Cmd+T): Focus on tag treemap</li>
                    <li>Tab: Navigate between interactive elements</li>
                    <li>Enter/Space: Activate focused element</li>
                </ul>
            </div>

            {children}
        </div>
    )
}

/**
 * Color contrast checker utility
 */
export function checkColorContrast(foreground: string, background: string): {
    ratio: number
    wcagAA: boolean
    wcagAAA: boolean
} {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd use a proper color contrast library
    const getLuminance = (color: string): number => {
        // This is a simplified version - use a proper color library in production
        const rgb = color.match(/\d+/g)
        if (!rgb) return 0

        const [r, g, b] = rgb.map(c => {
            const val = parseInt(c) / 255
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
        })

        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    return {
        ratio,
        wcagAA: ratio >= 4.5,
        wcagAAA: ratio >= 7
    }
}

export default AccessibilityEnhancements