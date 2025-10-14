import type { ActivityData, TagData } from '@/components/ActivityVisualizations/types'

/**
 * Load activity data from the generated JSON file
 */
export async function loadActivityData(): Promise<ActivityData[]> {
  try {
    const response = await fetch('/activity-data.json')
    if (!response.ok) {
      throw new Error(`Failed to load activity data: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading activity data:', error)
    return []
  }
}

/**
 * Load tag data from the generated JSON file
 */
export async function loadTagData(): Promise<TagData[]> {
  try {
    const response = await fetch('/tag-data.json')
    if (!response.ok) {
      throw new Error(`Failed to load tag data: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading tag data:', error)
    return []
  }
}

/**
 * Load visualization statistics
 */
export async function loadVisualizationStats() {
  try {
    const response = await fetch('/visualization-stats.json')
    if (!response.ok) {
      throw new Error(`Failed to load visualization stats: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading visualization stats:', error)
    return null
  }
}

/**
 * Load all visualization data at once
 */
export async function loadAllVisualizationData() {
  try {
    const [activityData, tagData, stats] = await Promise.all([
      loadActivityData(),
      loadTagData(),
      loadVisualizationStats(),
    ])

    return {
      activityData,
      tagData,
      stats,
      isLoaded: true,
    }
  } catch (error) {
    console.error('Error loading visualization data:', error)
    return {
      activityData: [],
      tagData: [],
      stats: null,
      isLoaded: false,
    }
  }
}

/**
 * React hook for loading visualization data
 */
export function useVisualizationData() {
  const [data, setData] = React.useState({
    activityData: [] as ActivityData[],
    tagData: [] as TagData[],
    stats: null as any,
    isLoading: true,
    error: null as string | null,
  })

  React.useEffect(() => {
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

// Note: React import will be added when this is used in a React component
// For now, we'll define the hook without the import to avoid build errors
declare const React: any
