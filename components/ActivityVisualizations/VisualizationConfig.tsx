import React from 'react'
import type { VisualizationConfig } from './types'

interface VisualizationConfigProps {
    config: VisualizationConfig
    onChange: (config: VisualizationConfig) => void
    className?: string
}

export function VisualizationConfig({
    config,
    onChange,
    className = ''
}: VisualizationConfigProps) {
    const updateHeatmapConfig = (updates: Partial<typeof config.heatmap>) => {
        onChange({
            ...config,
            heatmap: { ...config.heatmap, ...updates }
        })
    }

    const updateTreemapConfig = (updates: Partial<typeof config.treemap>) => {
        onChange({
            ...config,
            treemap: { ...config.treemap, ...updates }
        })
    }

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                    Activity Heatmap Settings
                </h4>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.heatmap.enabled}
                            onChange={(e) => updateHeatmapConfig({ enabled: e.target.checked })}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Enable heatmap</span>
                    </label>

                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300">
                            Weeks to show:
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="104"
                            value={config.heatmap.weeksToShow}
                            onChange={(e) => updateHeatmapConfig({ weeksToShow: parseInt(e.target.value) })}
                            className="mt-1 block w-20 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                    Tag Treemap Settings
                </h4>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.treemap.enabled}
                            onChange={(e) => updateTreemapConfig({ enabled: e.target.checked })}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Enable treemap</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.treemap.enableZoom}
                            onChange={(e) => updateTreemapConfig({ enableZoom: e.target.checked })}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Enable zoom</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.treemap.linkToTagPages}
                            onChange={(e) => updateTreemapConfig({ linkToTagPages: e.target.checked })}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Link to tag pages</span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default VisualizationConfig