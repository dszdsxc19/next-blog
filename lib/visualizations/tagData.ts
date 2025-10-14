import type { Blog } from 'contentlayer/generated'
import type { TagData, TagHierarchy } from '@/components/ActivityVisualizations/types'

/**
 * Generate tag distribution data for treemap visualization
 */
export function generateTagData(posts: Blog[], hierarchy?: TagHierarchy): TagData[] {
  // Count tag usage across all posts
  const tagCounts = new Map<string, number>()
  const tagPosts = new Map<string, Blog[]>()

  // Filter out draft posts and category index posts
  const publishedPosts = posts.filter(
    (post) => !post.draft && !post.category && post.tags && post.tags.length > 0
  )

  publishedPosts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        if (!tagPosts.has(tag)) {
          tagPosts.set(tag, [])
        }
        tagPosts.get(tag)!.push(post)
      })
    }
  })

  // If hierarchy is provided, organize tags hierarchically
  if (hierarchy) {
    return buildHierarchicalTagData(tagCounts, hierarchy)
  }

  // Otherwise, return flat tag data
  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      color: generateTagColor(name, count),
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Build hierarchical tag data structure for nested treemap
 */
function buildHierarchicalTagData(
  tagCounts: Map<string, number>,
  hierarchy: TagHierarchy
): TagData[] {
  const result: TagData[] = []

  Object.entries(hierarchy).forEach(([categoryName, categoryConfig]) => {
    const categoryTags: TagData[] = []
    let categoryTotal = 0

    // Add direct tags for this category
    categoryConfig.tags.forEach((tagName) => {
      const count = tagCounts.get(tagName) || 0
      if (count > 0) {
        categoryTags.push({
          name: tagName,
          count,
          category: categoryName,
          color: categoryConfig.color || generateTagColor(tagName, count),
        })
        categoryTotal += count
      }
    })

    // Add subcategories recursively
    if (categoryConfig.subcategories) {
      const subcategoryData = buildHierarchicalTagData(tagCounts, categoryConfig.subcategories)
      categoryTags.push(...subcategoryData)
      categoryTotal += subcategoryData.reduce((sum, tag) => sum + tag.count, 0)
    }

    if (categoryTotal > 0) {
      result.push({
        name: categoryName,
        count: categoryTotal,
        children: categoryTags,
        color: categoryConfig.color || generateCategoryColor(categoryName),
      })
    }
  })

  return result.sort((a, b) => b.count - a.count)
}

/**
 * Generate color for a tag based on its name and frequency
 */
function generateTagColor(tagName: string, count: number): string {
  // Simple hash-based color generation
  let hash = 0
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert to HSL for better color distribution
  const hue = Math.abs(hash) % 360
  const saturation = 45 + (count % 30) // Vary saturation based on frequency
  const lightness = 60 + (count % 20) // Vary lightness based on frequency

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * Generate color for a category
 */
function generateCategoryColor(categoryName: string): string {
  const categoryColors: Record<string, string> = {
    Technology: '#3b82f6',
    'Computer Science': '#8b5cf6',
    'Web Development': '#10b981',
    Programming: '#f59e0b',
    Design: '#ef4444',
    Tutorial: '#06b6d4',
    Opinion: '#84cc16',
    Review: '#f97316',
  }

  return categoryColors[categoryName] || generateTagColor(categoryName, 1)
}

/**
 * Filter tags by minimum post count
 */
export function filterTagsByMinCount(tagData: TagData[], minCount: number): TagData[] {
  return tagData
    .filter((tag) => tag.count >= minCount)
    .map((tag) => ({
      ...tag,
      children: tag.children ? filterTagsByMinCount(tag.children, minCount) : undefined,
    }))
}

/**
 * Get top N tags by post count
 */
export function getTopTags(tagData: TagData[], limit: number): TagData[] {
  return tagData.sort((a, b) => b.count - a.count).slice(0, limit)
}

/**
 * Calculate tag statistics for summary display
 */
export function getTagStats(tagData: TagData[]) {
  const flatTags = flattenTagData(tagData)
  const totalTags = flatTags.length
  const totalPosts = flatTags.reduce((sum, tag) => sum + tag.count, 0)
  const averagePostsPerTag = totalTags > 0 ? totalPosts / totalTags : 0
  const mostUsedTag = flatTags.reduce((max, tag) => (tag.count > max.count ? tag : max), {
    name: '',
    count: 0,
  })

  return {
    totalTags,
    totalPosts,
    averagePostsPerTag,
    mostUsedTag: mostUsedTag.count > 0 ? mostUsedTag : null,
  }
}

/**
 * Flatten hierarchical tag data for statistics
 */
function flattenTagData(tagData: TagData[]): TagData[] {
  const result: TagData[] = []

  tagData.forEach((tag) => {
    if (tag.children && tag.children.length > 0) {
      result.push(...flattenTagData(tag.children))
    } else {
      result.push(tag)
    }
  })

  return result
}

/**
 * Create default tag hierarchy based on common patterns
 */
export function createDefaultTagHierarchy(posts: Blog[]): TagHierarchy {
  // Filter out draft posts and category index posts
  const publishedPosts = posts.filter(
    (post) => !post.draft && !post.category && post.tags && post.tags.length > 0
  )

  const allTags = new Set<string>()

  publishedPosts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => allTags.add(tag))
    }
  })

  const tags = Array.from(allTags)

  // Categorize tags based on common patterns
  const techTags = tags.filter((tag) =>
    /^(react|vue|angular|javascript|typescript|node|python|java|go|rust|css|html|api|database|sql|nosql)$/i.test(
      tag
    )
  )

  const csTags = tags.filter((tag) =>
    /^(algorithm|data-structure|system-design|computer-science|math|statistics)$/i.test(tag)
  )

  const webTags = tags.filter((tag) =>
    /^(frontend|backend|fullstack|web|mobile|responsive|ui|ux|design)$/i.test(tag)
  )

  const tutorialTags = tags.filter((tag) =>
    /^(tutorial|guide|howto|tips|tricks|best-practices)$/i.test(tag)
  )

  // Remaining tags go to "Other"
  const otherTags = tags.filter(
    (tag) => ![...techTags, ...csTags, ...webTags, ...tutorialTags].includes(tag)
  )

  const hierarchy: TagHierarchy = {}

  if (techTags.length > 0) {
    hierarchy['Technology'] = { tags: techTags }
  }

  if (csTags.length > 0) {
    hierarchy['Computer Science'] = { tags: csTags }
  }

  if (webTags.length > 0) {
    hierarchy['Web Development'] = { tags: webTags }
  }

  if (tutorialTags.length > 0) {
    hierarchy['Tutorials'] = { tags: tutorialTags }
  }

  if (otherTags.length > 0) {
    hierarchy['Other'] = { tags: otherTags }
  }

  return hierarchy
}
