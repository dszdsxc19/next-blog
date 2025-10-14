import { writeFileSync } from 'fs'
import path from 'path'
import type { Blog } from 'contentlayer/generated'
import { generateActivityData } from './activityData'
import { generateTagData, createDefaultTagHierarchy } from './tagData'
import { visualizationCache } from './dataCache'
import siteMetadata from '@/data/siteMetadata'

/**
 * Generate visualization data at build time and write to JSON files
 */
export async function generateVisualizationData(allBlogs: Blog[]) {
  try {
    console.log('Generating visualization data...')

    // Generate activity data
    const activityData = generateActivityData(allBlogs)
    console.log(`Generated activity data for ${activityData.length} days`)

    // Generate tag data with default hierarchy
    const defaultHierarchy = createDefaultTagHierarchy(allBlogs)
    const tagData = generateTagData(allBlogs, defaultHierarchy)
    console.log(`Generated tag data for ${tagData.length} categories`)

    // Write to public directory for client-side access
    const publicDir = path.join(process.cwd(), 'public')

    writeFileSync(path.join(publicDir, 'activity-data.json'), JSON.stringify(activityData, null, 2))

    writeFileSync(path.join(publicDir, 'tag-data.json'), JSON.stringify(tagData, null, 2))

    // Also cache the data for faster subsequent builds
    await visualizationCache.cacheActivityData(activityData)
    await visualizationCache.cacheTagData(tagData)

    // Generate summary statistics
    const stats = {
      activityStats: {
        totalDays: activityData.length,
        totalPosts: activityData.reduce((sum, day) => sum + day.count, 0),
        activeDays: activityData.filter((day) => day.count > 0).length,
        maxPostsInDay: Math.max(...activityData.map((day) => day.count), 0),
        dateRange: {
          start: activityData[0]?.date || null,
          end: activityData[activityData.length - 1]?.date || null,
        },
      },
      tagStats: {
        totalTags: tagData.length,
        totalCategories: tagData.filter((tag) => tag.children && tag.children.length > 0).length,
        mostUsedTag: tagData.reduce((max, tag) => (tag.count > max.count ? tag : max), {
          name: '',
          count: 0,
        }),
      },
      generatedAt: new Date().toISOString(),
    }

    writeFileSync(path.join(publicDir, 'visualization-stats.json'), JSON.stringify(stats, null, 2))

    console.log('Visualization data generation completed successfully')
    return { activityData, tagData, stats }
  } catch (error) {
    console.error('Failed to generate visualization data:', error)
    throw error
  }
}

/**
 * Load visualization configuration from site metadata
 */
export function getVisualizationConfig() {
  // Default configuration
  const defaultConfig = {
    heatmap: {
      enabled: true,
      weeksToShow: 52,
      colorScheme: 'github' as const,
      showTooltips: true,
    },
    treemap: {
      enabled: true,
      hierarchical: true,
      colorScheme: 'category' as const,
      enableZoom: true,
      linkToTagPages: true,
    },
    external: {},
  }

  // Merge with site metadata if available
  const siteConfig = (siteMetadata as any)?.visualizations

  return {
    ...defaultConfig,
    ...siteConfig,
  }
}

/**
 * Check if visualization data needs regeneration
 */
export async function shouldRegenerateData(allBlogs: Blog[]): Promise<boolean> {
  try {
    // Check if cached data exists and is valid
    const cachedActivity = await visualizationCache.loadActivityData()
    const cachedTags = await visualizationCache.loadTagData()

    if (!cachedActivity || !cachedTags) {
      return true
    }

    // Check if the number of posts has changed
    const currentPostCount = allBlogs.filter((post) => !post.draft && !post.category).length

    const cachedPostCount = cachedActivity.reduce((sum, day) => sum + day.count, 0)

    return currentPostCount !== cachedPostCount
  } catch (error) {
    console.warn('Error checking cache validity, regenerating data:', error)
    return true
  }
}

/**
 * Clean up old visualization data files
 */
export function cleanupVisualizationData() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const filesToClean = ['activity-data.json', 'tag-data.json', 'visualization-stats.json']

    filesToClean.forEach((file) => {
      const filePath = path.join(publicDir, file)
      try {
        const fs = require('fs')
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch (error) {
        console.warn(`Failed to clean up ${file}:`, error)
      }
    })
  } catch (error) {
    console.warn('Error during cleanup:', error)
  }
}
