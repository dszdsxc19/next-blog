'use client'

import React, { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { ActivityData, TagData, VisualizationConfig } from './types'

// Lazy load visualization components
const ActivityHeatmap = lazy(() => import('./ActivityHeatmap'))
const TagTreemap = lazy(() => import('./TagTreemap'))

interface LazyVisualizationLoaderProps {
    type: 'heatmap' | 'treemap'
    data: ActivityData[] | TagData[]
    config: any
    className?: string
}

export function LazyVisualizationLoader({
    type,
    data,
    config,
    className = ''
}: LazyVisualizationLoaderProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries
                if (entry.isIntersecting && !hasLoaded) {
                    setIsVisible(true)
                    setHasLoaded(true)
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current)
            }
        }
    }, [hasLoaded])

    const renderVisualization = () => {
        if (type === 'heatmap') {
            return (
                <ActivityHeatmap
                    data={data as ActivityData[]}
                    config={config}
                    className={className}
                />
            )
        } else {
            return (
                <TagTreemap
                    data={data as TagData[]}
                    config={config}
                    className={className}
                />
            )
        }
    }

    return (
        <div ref={containerRef} className={`min-h-[200px] ${className}`}>
            {isVisible ? (
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner
                                size="lg"
                                text={`Loading ${type === 'heatmap' ? 'activity heatmap' : 'tag treemap'}...`}
                            />
                        </div>
                    }
                >
                    {renderVisualization()}
                </Suspense>
            ) : (
                <div className="flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2 mx-auto"></div>
                            <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
                        </div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Scroll down to load {type === 'heatmap' ? 'activity visualization' : 'content topics'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * Bundle size monitoring utility
 */
export class BundleSizeMonitor {
    private static instance: BundleSizeMonitor
    private loadTimes: Map<string, number> = new Map()
    private bundleSizes: Map<string, number> = new Map()

    static getInstance(): BundleSizeMonitor {
        if (!BundleSizeMonitor.instance) {
            BundleSizeMonitor.instance = new BundleSizeMonitor()
        }
        return BundleSizeMonitor.instance
    }

    recordLoadTime(component: string, startTime: number): void {
        const loadTime = performance.now() - startTime
        this.loadTimes.set(component, loadTime)

        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 ${component} loaded in ${loadTime.toFixed(2)}ms`)
        }
    }

    recordBundleSize(component: string, size: number): void {
        this.bundleSizes.set(component, size)

        if (process.env.NODE_ENV === 'development') {
            console.log(`📦 ${component} bundle size: ${(size / 1024).toFixed(2)}KB`)
        }
    }

    getMetrics(): {
        loadTimes: Record<string, number>
        bundleSizes: Record<string, number>
        totalLoadTime: number
        totalBundleSize: number
    } {
        const loadTimes = Object.fromEntries(this.loadTimes)
        const bundleSizes = Object.fromEntries(this.bundleSizes)

        return {
            loadTimes,
            bundleSizes,
            totalLoadTime: Array.from(this.loadTimes.values()).reduce((sum, time) => sum + time, 0),
            totalBundleSize: Array.from(this.bundleSizes.values()).reduce((sum, size) => sum + size, 0)
        }
    }

    reset(): void {
        this.loadTimes.clear()
        this.bundleSizes.clear()
    }
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitoring(componentName: string) {
    const monitor = BundleSizeMonitor.getInstance()
    const startTimeRef = useRef<number>()

    useEffect(() => {
        startTimeRef.current = performance.now()

        return () => {
            if (startTimeRef.current) {
                monitor.recordLoadTime(componentName, startTimeRef.current)
            }
        }
    }, [componentName, monitor])

    const recordBundleSize = (size: number) => {
        monitor.recordBundleSize(componentName, size)
    }

    return { recordBundleSize, getMetrics: () => monitor.getMetrics() }
}

/**
 * Code splitting utility for dynamic imports
 */
export const dynamicImports = {
    // Visualization libraries
    calHeatmap: () => import('cal-heatmap'),
    observablePlot: () => import('@observablehq/plot'),

    // Plugins
    calHeatmapTooltip: () => import('cal-heatmap/plugins/Tooltip'),
    calHeatmapLegend: () => import('cal-heatmap/plugins/Legend'),
    calHeatmapCalendarLabel: () => import('cal-heatmap/plugins/CalendarLabel'),

    // Utility functions
    dataProcessing: () => import('@/lib/visualizations/activityData'),
    tagProcessing: () => import('@/lib/visualizations/tagData'),

    // Configuration
    config: () => import('@/lib/visualizations/config'),
    featureFlags: () => import('@/lib/visualizations/featureFlags')
}

/**
 * Preload critical visualization resources
 */
export function preloadVisualizationResources() {
    if (typeof window !== 'undefined') {
        // Preload critical libraries
        const preloadPromises = [
            dynamicImports.calHeatmap(),
            dynamicImports.observablePlot()
        ]

        // Preload in background without blocking
        Promise.all(preloadPromises).catch(error => {
            console.warn('Failed to preload visualization resources:', error)
        })
    }
}

/**
 * Resource cleanup utility
 */
export function cleanupVisualizationResources() {
    // Clean up any global resources, event listeners, etc.
    if (typeof window !== 'undefined') {
        // Remove any global event listeners
        window.removeEventListener('resize', handleResize)

        // Clear any intervals or timeouts
        // (This would be implemented based on specific needs)
    }
}

function handleResize() {
    // Placeholder for resize handler
    // This would be implemented to handle responsive updates
}

export default LazyVisualizationLoader