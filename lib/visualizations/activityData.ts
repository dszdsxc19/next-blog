import type { Blog } from 'contentlayer/generated'
import type {
  ActivityData,
  WeeklyActivity,
  DayActivity,
  PostSummary,
} from '@/components/ActivityVisualizations/types'

/**
 * Generate activity data for heatmap visualization from blog posts
 */
export function generateActivityData(posts: Blog[]): ActivityData[] {
  // Filter out draft posts and category index posts
  const publishedPosts = posts.filter((post) => !post.draft && !post.category && post.date)

  // Group posts by publication date
  const postsByDate = new Map<string, Blog[]>()

  publishedPosts.forEach((post) => {
    // Handle timezone and ensure consistent date formatting
    const postDate = new Date(post.date)
    const dateKey = postDate.toISOString().split('T')[0] // YYYY-MM-DD format

    if (!postsByDate.has(dateKey)) {
      postsByDate.set(dateKey, [])
    }
    postsByDate.get(dateKey)!.push(post)
  })

  // Convert to ActivityData format
  const activityData: ActivityData[] = []

  postsByDate.forEach((postsForDate, date) => {
    activityData.push({
      date,
      count: postsForDate.length,
      posts: postsForDate.map((post) => ({
        title: post.title,
        slug: post.slug,
      })),
    })
  })

  return activityData.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Generate weekly activity data structure for advanced heatmap features
 */
export function generateWeeklyActivity(posts: Blog[], weeksToShow: number = 52): WeeklyActivity[] {
  const now = new Date()
  const startDate = new Date(now.getTime() - weeksToShow * 7 * 24 * 60 * 60 * 1000)

  const weeklyData: WeeklyActivity[] = []

  // Generate weeks from startDate to now
  for (let weekOffset = 0; weekOffset < weeksToShow; weekOffset++) {
    const weekStart = new Date(startDate.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000)
    const weekString = getISOWeek(weekStart)

    const days: DayActivity[] = []

    // Generate 7 days for each week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDay = new Date(weekStart.getTime() + dayOffset * 24 * 60 * 60 * 1000)
      const dateString = currentDay.toISOString().split('T')[0]

      // Find posts for this day (filter published posts only)
      const publishedPosts = posts.filter((post) => !post.draft && !post.category && post.date)
      const postsForDay = publishedPosts.filter((post) => {
        const postDate = new Date(post.date).toISOString().split('T')[0]
        return postDate === dateString
      })

      const postSummaries: PostSummary[] = postsForDay.map((post) => ({
        title: post.title,
        slug: post.slug,
        tags: post.tags || [],
      }))

      days.push({
        date: dateString,
        count: postsForDay.length,
        intensity: calculateIntensity(postsForDay.length),
        posts: postSummaries,
      })
    }

    weeklyData.push({
      week: weekString,
      days,
    })
  }

  return weeklyData
}

/**
 * Calculate GitHub-style intensity level (0-4) based on post count
 */
function calculateIntensity(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}

/**
 * Get ISO week string (YYYY-Www) for a given date
 */
function getISOWeek(date: Date): string {
  const year = date.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7)

  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}

/**
 * Filter activity data by date range
 */
export function filterActivityByDateRange(
  activityData: ActivityData[],
  startDate: Date,
  endDate: Date
): ActivityData[] {
  const start = startDate.toISOString().split('T')[0]
  const end = endDate.toISOString().split('T')[0]

  return activityData.filter((activity) => activity.date >= start && activity.date <= end)
}

/**
 * Get activity statistics for summary display
 */
export function getActivityStats(activityData: ActivityData[]) {
  const totalPosts = activityData.reduce((sum, day) => sum + day.count, 0)
  const activeDays = activityData.filter((day) => day.count > 0).length
  const maxPostsInDay = Math.max(...activityData.map((day) => day.count), 0)

  return {
    totalPosts,
    activeDays,
    maxPostsInDay,
    averagePostsPerActiveDay: activeDays > 0 ? totalPosts / activeDays : 0,
  }
}
