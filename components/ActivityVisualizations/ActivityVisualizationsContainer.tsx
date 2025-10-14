'use client'

import React, { useEffect, useState } from 'react'
import { ActivityVisualizations } from './index'
import { useVisualizationData } from '@/lib/visualizations/useVisualizationData'
import { getVisualizationConfig } from '@/lib/visualizations/featureFlags'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { VisualizationThemeProvider, VisualizationThemeStyles } from './ThemeProvider'
import type { ActivityData, TagData, VisualizationConfig } from './types'

interface VisualizationState {
    activityData: ActivityData[]
    tagData: TagData[]
    config: VisualizationConfig
    isLoading: boolean
    error: string | null
}

export function ActivityVisualizationsContainer() {
    const [state, setState] = useState<VisualizationState>({
        activityData: [],
        tagData: [],
        config: getVisualizationConfig(),
        isLoading: true,
        error: null
    })

    useEffect(() => {
        let mounted = true

        const loadVisualizationData = async () => {
            try {
                // Load data from the generated JSON files
                const [activityResponse, tagResponse] = await Promise.all([
                    fetch('/activity-data.json'),
                    fetch('/tag-data.json')
                ])

                if (!activityResponse.ok || !tagResponse.ok) {
                    throw new Error('Failed to load visualization data')
                }

                const [activityData, tagData] = await Promise.all([
                    activityResponse.json(),
                    tagResponse.json()
                ])

                if (mounted) {
                    setState(prev => ({
                        ...prev,
                        activityData,
                        tagData,
                        isLoading: false,
                        error: null
                    }))
                }
            } catch (error) {
                console.error('Error loading visualization data:', error)
                if (mounted) {
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Failed to load data'
                    }))
                }
            }
        }

        loadVisualizationData()

        return () => {
            mounted = false
        }
    }, [])

    // Check if any visualizations are enabled
    const hasEnabledVisualizations = state.config.heatmap.enabled || state.config.treemap.enabled

    if (!hasEnabledVisualizations) {
        return null // Don't render anything if visualizations are disabled
    }

    if (state.isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading activity visualizations..." />
            </div>
        )
    }

    if (state.error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex items-center space-x-2">
                    <div className="text-red-600 dark:text-red-400">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                            Failed to load visualizations
                        </h3>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                            {state.error}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Don't render if no data is available
    if (state.activityData.length === 0 && state.tagData.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
                <div className="text-gray-600 dark:text-gray-400">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">No Activity Data</h3>
                    <p>Start writing blog posts to see your activity visualizations!</p>
                </div>
            </div>
        )
    }

    return (
        <VisualizationThemeProvider>
            <VisualizationThemeStyles />
            <div className="visualization-container space-y-6">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        Activity & Content Overview
                    </h2>
                    <ActivityVisualizations
                        activityData={state.activityData}
                        tagData={state.tagData}
                        config={state.config}
                    />
                </div>
            </div>
        </VisualizationThemeProvider>
    )
}

/**
 * Alternative container that uses the React hook for data loading
 */
export function ActivityVisualizationsContainerWithHook() {
    const { activityData, tagData, stats, isLoading, error } = useVisualizationData()
    const config = getVisualizationConfig()

    // Check if any visualizations are enabled
    const hasEnabledVisualizations = config.heatmap.enabled || config.treemap.enabled

    if (!hasEnabledVisualizations) {
        return null
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading activity visualizations..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                <div className="text-red-700 dark:text-red-400">
                    Failed to load visualizations: {error}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Activity & Content Overview
                    </h2>
                    {stats && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Last updated: {new Date(stats.generatedAt).toLocaleDateString()}
                        </div>
                    )}
                </div>
                <ActivityVisualizations
                    activityData={activityData}
                    tagData={tagData}
                    config={config}
                />
            </div>
        </div>
    )
}

export default ActivityVisualizationsContainer