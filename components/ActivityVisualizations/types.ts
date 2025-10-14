// Core data types for visualizations
export interface ActivityData {
  date: string // ISO date string (YYYY-MM-DD)
  count: number
  posts?: {
    title: string
    slug: string
  }[]
}

export interface TagData {
  name: string
  count: number
  category?: string
  children?: TagData[]
  color?: string
}

// Configuration interfaces
export interface HeatmapConfig {
  enabled: boolean
  weeksToShow: number
  colorScheme: 'github' | 'custom'
  customColors?: string[]
  showTooltips: boolean
}

export interface TreemapConfig {
  enabled: boolean
  hierarchical: boolean
  tagHierarchy?: Record<string, string[]>
  colorScheme: 'category' | 'frequency' | 'custom'
  customColors?: string[]
  enableZoom: boolean
  linkToTagPages: boolean
}

export interface ExternalConfig {
  github?: {
    enabled: boolean
    username: string
    token?: string
    includePrivate: boolean
  }
}

export interface VisualizationConfig {
  heatmap: HeatmapConfig
  treemap: TreemapConfig
  external: ExternalConfig
}

// Weekly activity data structure
export interface WeeklyActivity {
  week: string // ISO week string (YYYY-Www)
  days: DayActivity[]
}

export interface DayActivity {
  date: string
  count: number
  intensity: 0 | 1 | 2 | 3 | 4 // GitHub-style intensity levels
  posts: PostSummary[]
}

export interface PostSummary {
  title: string
  slug: string
  tags: string[]
}

// Tag hierarchy configuration
export interface TagHierarchy {
  [category: string]: {
    tags: string[]
    color?: string
    subcategories?: TagHierarchy
  }
}

// Error handling types
export interface VisualizationError {
  type: 'data' | 'render' | 'external'
  message: string
  fallback?: React.ComponentType
}
