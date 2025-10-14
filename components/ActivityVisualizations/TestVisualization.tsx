'use client'

import React from 'react'
import { ActivityVisualizations } from './index'
import type { ActivityData, TagData, VisualizationConfig } from './types'

// Test data
const testActivityData: ActivityData[] = [
    { date: '2024-01-01', count: 2, posts: [{ title: 'Test Post 1', slug: 'test-1' }] },
    { date: '2024-01-02', count: 1, posts: [{ title: 'Test Post 2', slug: 'test-2' }] },
    { date: '2024-01-03', count: 3, posts: [{ title: 'Test Post 3', slug: 'test-3' }] },
]

const testTagData: TagData[] = [
    { name: 'React', count: 5, color: '#61dafb' },
    { name: 'TypeScript', count: 8, color: '#3178c6' },
    { name: 'JavaScript', count: 3, color: '#f7df1e' },
    { name: 'CSS', count: 2, color: '#1572b6' },
]

const testConfig: VisualizationConfig = {
    heatmap: {
        enabled: true,
        weeksToShow: 52,
        colorScheme: 'github',
        showTooltips: true,
    },
    treemap: {
        enabled: true,
        hierarchical: false,
        colorScheme: 'category',
        enableZoom: true,
        linkToTagPages: true,
    },
    external: {},
}

export function TestVisualization() {
    return (
        <div className="p-6">
            <h2 className="mb-4 text-xl font-bold">Test Visualization</h2>
            <ActivityVisualizations
                activityData={testActivityData}
                tagData={testTagData}
                config={testConfig}
            />
        </div>
    )
}

export default TestVisualization