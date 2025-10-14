import React from 'react'
import { ActivityHeatmap } from './ActivityHeatmap'
import { TagTreemap } from './TagTreemap'
import { VisualizationFeature, withFeatureFlag, useFeatureFlags } from '@/lib/visualizations/featureFlags'
import type { VisualizationConfig, ActivityData, TagData } from './types'

interface ActivityVisualizationsProps {
    activityData: ActivityData[]
    tagData: TagData[]
    config?: VisualizationConfig
    className?: string
}

export function ActivityVisualizations({
    activityData,
    tagData,
    config,
    className = '',
}: ActivityVisualizationsProps) {
    const featureFlags = useFeatureFlags()

    // Use feature flags config if no config provided
    const finalConfig = config || featureFlags.config

    // Check if any visualizations are enabled
    const hasEnabledVisualizations = featureFlags.isHeatmapEnabled || featureFlags.isTreemapEnabled

    if (!hasEnabledVisualizations) {
        return (
            <div className={`rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800 ${className}`}>
                <p className="text-gray-600 dark:text-gray-400">
                    Visualizations are currently disabled. Enable them in your site configuration.
                </p>
            </div>
        )
    }

    return (
        <div className={`space-y-8 ${className}`}>
            {withFeatureFlag(
                VisualizationFeature.HEATMAP,
                <section key="heatmap">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Activity Overview
                    </h3>
                    <ActivityHeatmap data={activityData} config={finalConfig.heatmap} />
                </section>
            )}

            {withFeatureFlag(
                VisualizationFeature.TREEMAP,
                <section key="treemap">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Content Topics
                    </h3>
                    <TagTreemap data={tagData} config={finalConfig.treemap} />
                </section>
            )}

            {/* Development feature flag controls (only in development) */}
            {process.env.NODE_ENV === 'development' && (
                <FeatureFlagControls />
            )}
        </div>
    )
}

/**
 * Development component for controlling feature flags
 */
function FeatureFlagControls() {
    const featureFlags = useFeatureFlags()

    return (
        <details className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <summary className="cursor-pointer text-sm font-medium text-yellow-800 dark:text-yellow-200">
                🚧 Development: Feature Flag Controls
            </summary>
            <div className="mt-4 space-y-2">
                {Object.values(VisualizationFeature).map(feature => (
                    <label key={feature} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={featureFlags.isFeatureEnabled(feature)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    featureFlags.setFeatureOverride(feature, true)
                                } else {
                                    featureFlags.setFeatureOverride(feature, false)
                                }
                                // Force re-render (in a real app, this would be handled by state management)
                                window.location.reload()
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-yellow-700 dark:text-yellow-300">
                            {feature.replace('_', ' ')}
                        </span>
                    </label>
                ))}
            </div>
        </details>
    )
}

export default ActivityVisualizations