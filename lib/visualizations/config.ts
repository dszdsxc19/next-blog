import type {
  VisualizationConfig,
  HeatmapConfig,
  TreemapConfig,
  ExternalConfig,
} from '@/components/ActivityVisualizations/types'

/**
 * Default configuration values
 */
export const DEFAULT_HEATMAP_CONFIG: HeatmapConfig = {
  enabled: true,
  weeksToShow: 52,
  colorScheme: 'github',
  showTooltips: true,
}

export const DEFAULT_TREEMAP_CONFIG: TreemapConfig = {
  enabled: true,
  hierarchical: true,
  colorScheme: 'category',
  enableZoom: true,
  linkToTagPages: true,
}

export const DEFAULT_EXTERNAL_CONFIG: ExternalConfig = {}

export const DEFAULT_VISUALIZATION_CONFIG: VisualizationConfig = {
  heatmap: DEFAULT_HEATMAP_CONFIG,
  treemap: DEFAULT_TREEMAP_CONFIG,
  external: DEFAULT_EXTERNAL_CONFIG,
}

/**
 * Configuration validation functions
 */
export function validateHeatmapConfig(config: Partial<HeatmapConfig>): HeatmapConfig {
  return {
    enabled: typeof config.enabled === 'boolean' ? config.enabled : DEFAULT_HEATMAP_CONFIG.enabled,
    weeksToShow: validateWeeksToShow(config.weeksToShow),
    colorScheme: validateColorScheme(config.colorScheme, ['github', 'custom']),
    customColors: validateCustomColors(config.customColors),
    showTooltips:
      typeof config.showTooltips === 'boolean'
        ? config.showTooltips
        : DEFAULT_HEATMAP_CONFIG.showTooltips,
  }
}

export function validateTreemapConfig(config: Partial<TreemapConfig>): TreemapConfig {
  return {
    enabled: typeof config.enabled === 'boolean' ? config.enabled : DEFAULT_TREEMAP_CONFIG.enabled,
    hierarchical:
      typeof config.hierarchical === 'boolean'
        ? config.hierarchical
        : DEFAULT_TREEMAP_CONFIG.hierarchical,
    tagHierarchy: validateTagHierarchy(config.tagHierarchy),
    colorScheme: validateColorScheme(config.colorScheme, ['category', 'frequency', 'custom']),
    customColors: validateCustomColors(config.customColors),
    enableZoom:
      typeof config.enableZoom === 'boolean'
        ? config.enableZoom
        : DEFAULT_TREEMAP_CONFIG.enableZoom,
    linkToTagPages:
      typeof config.linkToTagPages === 'boolean'
        ? config.linkToTagPages
        : DEFAULT_TREEMAP_CONFIG.linkToTagPages,
  }
}

export function validateExternalConfig(config: Partial<ExternalConfig>): ExternalConfig {
  const result: ExternalConfig = {}

  if (config.github) {
    result.github = {
      enabled: typeof config.github.enabled === 'boolean' ? config.github.enabled : false,
      username: typeof config.github.username === 'string' ? config.github.username : '',
      token: typeof config.github.token === 'string' ? config.github.token : undefined,
      includePrivate:
        typeof config.github.includePrivate === 'boolean' ? config.github.includePrivate : false,
    }
  }

  return result
}

export function validateVisualizationConfig(
  config: Partial<VisualizationConfig>
): VisualizationConfig {
  return {
    heatmap: validateHeatmapConfig(config.heatmap || {}),
    treemap: validateTreemapConfig(config.treemap || {}),
    external: validateExternalConfig(config.external || {}),
  }
}

/**
 * Helper validation functions
 */
function validateWeeksToShow(weeks?: number): number {
  if (typeof weeks !== 'number' || weeks < 1 || weeks > 104) {
    return DEFAULT_HEATMAP_CONFIG.weeksToShow
  }
  return Math.floor(weeks)
}

function validateColorScheme<T extends string>(scheme: any, validSchemes: T[]): T {
  if (typeof scheme === 'string' && validSchemes.includes(scheme as T)) {
    return scheme as T
  }
  return validSchemes[0]
}

function validateCustomColors(colors?: string[]): string[] | undefined {
  if (!Array.isArray(colors)) {
    return undefined
  }

  // Validate that all items are valid CSS colors
  const validColors = colors.filter((color) => {
    if (typeof color !== 'string') return false

    // Basic validation for hex colors, rgb, hsl, and named colors
    const colorRegex = /^(#[0-9A-Fa-f]{3,8}|rgb\(.*\)|rgba\(.*\)|hsl\(.*\)|hsla\(.*\)|[a-zA-Z]+)$/
    return colorRegex.test(color)
  })

  return validColors.length > 0 ? validColors : undefined
}

function validateTagHierarchy(
  hierarchy?: Record<string, string[]>
): Record<string, string[]> | undefined {
  if (!hierarchy || typeof hierarchy !== 'object') {
    return undefined
  }

  const validHierarchy: Record<string, string[]> = {}

  for (const [category, tags] of Object.entries(hierarchy)) {
    if (typeof category === 'string' && Array.isArray(tags)) {
      const validTags = tags.filter((tag) => typeof tag === 'string' && tag.length > 0)
      if (validTags.length > 0) {
        validHierarchy[category] = validTags
      }
    }
  }

  return Object.keys(validHierarchy).length > 0 ? validHierarchy : undefined
}

/**
 * Configuration presets for common use cases
 */
export const CONFIG_PRESETS = {
  minimal: {
    heatmap: {
      enabled: true,
      weeksToShow: 26,
      colorScheme: 'github' as const,
      showTooltips: false,
    },
    treemap: {
      enabled: false,
      hierarchical: false,
      colorScheme: 'category' as const,
      enableZoom: false,
      linkToTagPages: false,
    },
    external: {},
  },

  standard: DEFAULT_VISUALIZATION_CONFIG,

  comprehensive: {
    heatmap: {
      enabled: true,
      weeksToShow: 78, // 1.5 years
      colorScheme: 'github' as const,
      showTooltips: true,
    },
    treemap: {
      enabled: true,
      hierarchical: true,
      colorScheme: 'frequency' as const,
      enableZoom: true,
      linkToTagPages: true,
    },
    external: {
      github: {
        enabled: false, // Disabled by default for privacy
        username: '',
        includePrivate: false,
      },
    },
  },
} as const

/**
 * Merge user configuration with defaults
 */
export function mergeWithDefaults(
  userConfig: Partial<VisualizationConfig>,
  preset: keyof typeof CONFIG_PRESETS = 'standard'
): VisualizationConfig {
  const baseConfig = CONFIG_PRESETS[preset]

  return {
    heatmap: {
      ...baseConfig.heatmap,
      ...userConfig.heatmap,
    },
    treemap: {
      ...baseConfig.treemap,
      ...userConfig.treemap,
    },
    external: {
      ...baseConfig.external,
      ...userConfig.external,
    },
  }
}

/**
 * Get configuration from environment variables
 */
export function getConfigFromEnv(): Partial<VisualizationConfig> {
  const config: Partial<VisualizationConfig> = {}

  // Heatmap configuration from env
  if (process.env.NEXT_PUBLIC_HEATMAP_ENABLED !== undefined) {
    config.heatmap = {
      ...config.heatmap,
      enabled: process.env.NEXT_PUBLIC_HEATMAP_ENABLED === 'true',
    }
  }

  if (process.env.NEXT_PUBLIC_HEATMAP_WEEKS) {
    const weeks = parseInt(process.env.NEXT_PUBLIC_HEATMAP_WEEKS, 10)
    if (!isNaN(weeks)) {
      config.heatmap = {
        ...config.heatmap,
        weeksToShow: weeks,
      }
    }
  }

  // Treemap configuration from env
  if (process.env.NEXT_PUBLIC_TREEMAP_ENABLED !== undefined) {
    config.treemap = {
      ...config.treemap,
      enabled: process.env.NEXT_PUBLIC_TREEMAP_ENABLED === 'true',
    }
  }

  // GitHub integration from env
  if (process.env.GITHUB_USERNAME) {
    config.external = {
      github: {
        enabled: process.env.NEXT_PUBLIC_GITHUB_INTEGRATION === 'true',
        username: process.env.GITHUB_USERNAME,
        token: process.env.GITHUB_TOKEN,
        includePrivate: process.env.GITHUB_INCLUDE_PRIVATE === 'true',
      },
    }
  }

  return config
}

/**
 * Configuration error types
 */
export class ConfigurationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message)
    this.name = 'ConfigurationError'
  }
}

/**
 * Validate configuration and throw errors for critical issues
 */
export function validateConfigurationStrict(config: VisualizationConfig): void {
  // Check if at least one visualization is enabled
  if (!config.heatmap.enabled && !config.treemap.enabled) {
    throw new ConfigurationError('At least one visualization must be enabled')
  }

  // Validate GitHub configuration if enabled
  if (config.external.github?.enabled) {
    if (!config.external.github.username) {
      throw new ConfigurationError(
        'GitHub username is required when GitHub integration is enabled',
        'external.github.username'
      )
    }
  }

  // Validate custom colors if specified
  if (config.heatmap.colorScheme === 'custom' && !config.heatmap.customColors) {
    throw new ConfigurationError(
      'Custom colors must be provided when using custom color scheme',
      'heatmap.customColors'
    )
  }

  if (config.treemap.colorScheme === 'custom' && !config.treemap.customColors) {
    throw new ConfigurationError(
      'Custom colors must be provided when using custom color scheme',
      'treemap.customColors'
    )
  }
}
