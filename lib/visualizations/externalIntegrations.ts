import type { ActivityData, ExternalConfig } from '@/components/ActivityVisualizations/types'

/**
 * GitHub API integration for fetching commit activity
 */
export class GitHubIntegration {
  private username: string
  private token?: string
  private includePrivate: boolean

  constructor(config: ExternalConfig['github']) {
    if (!config) {
      throw new Error('GitHub configuration is required')
    }

    this.username = config.username
    this.token = config.token
    this.includePrivate = config.includePrivate
  }

  /**
   * Fetch commit activity from GitHub API
   */
  async fetchCommitActivity(): Promise<ActivityData[]> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Blog-Activity-Visualizer',
      }

      if (this.token) {
        headers['Authorization'] = `token ${this.token}`
      }

      // Fetch user events (commits, issues, PRs, etc.)
      const eventsUrl = `https://api.github.com/users/${this.username}/events`
      const response = await fetch(eventsUrl, { headers })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const events = await response.json()

      // Filter and process commit events
      const commitEvents = events.filter(
        (event: any) => event.type === 'PushEvent' && (this.includePrivate || !event.repo.private)
      )

      return this.processCommitEvents(commitEvents)
    } catch (error) {
      console.error('Failed to fetch GitHub activity:', error)
      return []
    }
  }

  /**
   * Process GitHub events into ActivityData format
   */
  private processCommitEvents(events: any[]): ActivityData[] {
    const activityMap = new Map<string, { count: number; commits: any[] }>()

    events.forEach((event) => {
      if (event.payload && event.payload.commits) {
        event.payload.commits.forEach((commit: any) => {
          const date = new Date(commit.author.date).toISOString().split('T')[0]

          if (!activityMap.has(date)) {
            activityMap.set(date, { count: 0, commits: [] })
          }

          const dayData = activityMap.get(date)!
          dayData.count++
          dayData.commits.push({
            message: commit.message,
            sha: commit.sha,
            url: commit.url,
          })
        })
      }
    })

    return Array.from(activityMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      posts: data.commits.map((commit) => ({
        title: commit.message.split('\n')[0], // First line of commit message
        slug: commit.sha,
      })),
    }))
  }

  /**
   * Fetch repository statistics
   */
  async fetchRepositoryStats() {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Blog-Activity-Visualizer',
      }

      if (this.token) {
        headers['Authorization'] = `token ${this.token}`
      }

      const reposUrl = `https://api.github.com/users/${this.username}/repos`
      const response = await fetch(reposUrl, { headers })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const repos = await response.json()

      return {
        totalRepos: repos.length,
        publicRepos: repos.filter((repo: any) => !repo.private).length,
        totalStars: repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
        languages: this.extractLanguages(repos),
      }
    } catch (error) {
      console.error('Failed to fetch repository stats:', error)
      return null
    }
  }

  /**
   * Extract programming languages from repositories
   */
  private extractLanguages(repos: any[]) {
    const languages = new Map<string, number>()

    repos.forEach((repo) => {
      if (repo.language) {
        languages.set(repo.language, (languages.get(repo.language) || 0) + 1)
      }
    })

    return Array.from(languages.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }
}

/**
 * Rate limiting utility for external API calls
 */
export class RateLimiter {
  private requests: number[]
  private maxRequests: number
  private timeWindow: number

  constructor(maxRequests: number = 60, timeWindowMs: number = 60000) {
    this.requests = []
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowMs
  }

  /**
   * Check if a request can be made without exceeding rate limits
   */
  canMakeRequest(): boolean {
    const now = Date.now()

    // Remove old requests outside the time window
    this.requests = this.requests.filter((timestamp) => now - timestamp < this.timeWindow)

    return this.requests.length < this.maxRequests
  }

  /**
   * Record a request timestamp
   */
  recordRequest(): void {
    this.requests.push(Date.now())
  }

  /**
   * Get time until next request can be made
   */
  getTimeUntilNextRequest(): number {
    if (this.canMakeRequest()) {
      return 0
    }

    const oldestRequest = Math.min(...this.requests)
    return this.timeWindow - (Date.now() - oldestRequest)
  }
}

/**
 * Cache for external API responses
 */
export class ExternalDataCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  /**
   * Get cached data if still valid
   */
  get(key: string): any | null {
    const cached = this.cache.get(key)

    if (!cached) {
      return null
    }

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  /**
   * Set cached data with TTL
   */
  set(key: string, data: any, ttlMs: number = 300000): void {
    // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }

  /**
   * Clear expired cache entries
   */
  cleanup(): void {
    const now = Date.now()

    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }
}

/**
 * Merge blog post activity with external activity data
 */
export function mergeActivityData(
  blogActivity: ActivityData[],
  externalActivity: ActivityData[]
): ActivityData[] {
  const merged = new Map<string, ActivityData>()

  // Add blog activity
  blogActivity.forEach((activity) => {
    merged.set(activity.date, { ...activity })
  })

  // Merge external activity
  externalActivity.forEach((activity) => {
    const existing = merged.get(activity.date)

    if (existing) {
      merged.set(activity.date, {
        date: activity.date,
        count: existing.count + activity.count,
        posts: [...(existing.posts || []), ...(activity.posts || [])],
      })
    } else {
      merged.set(activity.date, { ...activity })
    }
  })

  return Array.from(merged.values()).sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Default instances for common use cases
 */
export const defaultRateLimiter = new RateLimiter()
export const defaultExternalCache = new ExternalDataCache()
