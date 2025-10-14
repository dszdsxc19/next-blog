import fs from 'fs'
import path from 'path'
import type { ActivityData, TagData } from '@/components/ActivityVisualizations/types'

const CACHE_DIR = '.contentlayer/cache'
const ACTIVITY_CACHE_FILE = 'activity-data.json'
const TAG_CACHE_FILE = 'tag-data.json'

/**
 * Cache visualization data to disk for build-time optimization
 */
export class VisualizationDataCache {
  private cacheDir: string

  constructor(cacheDir: string = CACHE_DIR) {
    this.cacheDir = cacheDir
    this.ensureCacheDir()
  }

  private ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true })
    }
  }

  /**
   * Cache activity data
   */
  async cacheActivityData(data: ActivityData[]): Promise<void> {
    const filePath = path.join(this.cacheDir, ACTIVITY_CACHE_FILE)
    const cacheData = {
      timestamp: Date.now(),
      data,
    }

    try {
      await fs.promises.writeFile(filePath, JSON.stringify(cacheData, null, 2))
    } catch (error) {
      console.warn('Failed to cache activity data:', error)
    }
  }

  /**
   * Cache tag data
   */
  async cacheTagData(data: TagData[]): Promise<void> {
    const filePath = path.join(this.cacheDir, TAG_CACHE_FILE)
    const cacheData = {
      timestamp: Date.now(),
      data,
    }

    try {
      await fs.promises.writeFile(filePath, JSON.stringify(cacheData, null, 2))
    } catch (error) {
      console.warn('Failed to cache tag data:', error)
    }
  }

  /**
   * Load cached activity data
   */
  async loadActivityData(): Promise<ActivityData[] | null> {
    const filePath = path.join(this.cacheDir, ACTIVITY_CACHE_FILE)

    try {
      if (!fs.existsSync(filePath)) {
        return null
      }

      const fileContent = await fs.promises.readFile(filePath, 'utf-8')
      const cacheData = JSON.parse(fileContent)

      // Check if cache is still valid (less than 1 hour old)
      const isValid = Date.now() - cacheData.timestamp < 60 * 60 * 1000

      return isValid ? cacheData.data : null
    } catch (error) {
      console.warn('Failed to load cached activity data:', error)
      return null
    }
  }

  /**
   * Load cached tag data
   */
  async loadTagData(): Promise<TagData[] | null> {
    const filePath = path.join(this.cacheDir, TAG_CACHE_FILE)

    try {
      if (!fs.existsSync(filePath)) {
        return null
      }

      const fileContent = await fs.promises.readFile(filePath, 'utf-8')
      const cacheData = JSON.parse(fileContent)

      // Check if cache is still valid (less than 1 hour old)
      const isValid = Date.now() - cacheData.timestamp < 60 * 60 * 1000

      return isValid ? cacheData.data : null
    } catch (error) {
      console.warn('Failed to load cached tag data:', error)
      return null
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    try {
      const activityPath = path.join(this.cacheDir, ACTIVITY_CACHE_FILE)
      const tagPath = path.join(this.cacheDir, TAG_CACHE_FILE)

      if (fs.existsSync(activityPath)) {
        await fs.promises.unlink(activityPath)
      }

      if (fs.existsSync(tagPath)) {
        await fs.promises.unlink(tagPath)
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    const activityPath = path.join(this.cacheDir, ACTIVITY_CACHE_FILE)
    const tagPath = path.join(this.cacheDir, TAG_CACHE_FILE)

    const stats = {
      activityCache: {
        exists: fs.existsSync(activityPath),
        size: 0,
        lastModified: null as Date | null,
      },
      tagCache: {
        exists: fs.existsSync(tagPath),
        size: 0,
        lastModified: null as Date | null,
      },
    }

    try {
      if (stats.activityCache.exists) {
        const activityStats = await fs.promises.stat(activityPath)
        stats.activityCache.size = activityStats.size
        stats.activityCache.lastModified = activityStats.mtime
      }

      if (stats.tagCache.exists) {
        const tagStats = await fs.promises.stat(tagPath)
        stats.tagCache.size = tagStats.size
        stats.tagCache.lastModified = tagStats.mtime
      }
    } catch (error) {
      console.warn('Failed to get cache stats:', error)
    }

    return stats
  }
}

/**
 * Default cache instance
 */
export const visualizationCache = new VisualizationDataCache()

/**
 * Utility function to generate cache key based on content hash
 */
export function generateCacheKey(content: string): string {
  // Simple hash function for cache key generation
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Check if cached data is still valid based on source file modification times
 */
export async function isCacheValid(
  cacheTimestamp: number,
  sourceFiles: string[]
): Promise<boolean> {
  try {
    for (const file of sourceFiles) {
      if (fs.existsSync(file)) {
        const stats = await fs.promises.stat(file)
        if (stats.mtime.getTime() > cacheTimestamp) {
          return false
        }
      }
    }
    return true
  } catch (error) {
    console.warn('Failed to check cache validity:', error)
    return false
  }
}
