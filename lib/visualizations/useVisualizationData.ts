'use client'

import { useState, useEffect } from 'react'
import type { ActivityData, TagData } from '@/components/ActivityVisualizations/types'
import { loadAllVisualizationData } from './clientDataLoader'

/**
 * React hook for loading visualization data
 */
export function useVisualizationData() {
  const [data, setData] = useState({
    activityData: [] as ActivityData[],
    tagData: [] as TagData[],
    stats: null as any,
    isLoading: true,
    error: null as string | null,
  })

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const result = await loadAllVisualizationData()

        if (mounted) {
          setData({
            activityData: result.activityData,
            tagData: result.tagData,
            stats: result.stats,
            isLoading: false,
            error: result.isLoaded ? null : 'Failed to load data',
          })
        }
      } catch (error) {
        if (mounted) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }))
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  return data
}
