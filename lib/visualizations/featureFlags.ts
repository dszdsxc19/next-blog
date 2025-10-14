import siteMetadata from '@/data/siteMetadata'
import { getConfigFromEnv, mergeWithDefaults, validateVisualizationConfig } from './config'
import type { VisualizationConfig } from '@/components/ActivityVisualizations/types'

/**
 * Feature flag keys for visualizations
 */
export enum VisualizationFeature {
  HEATMAP = 'heatmap',
  TREEMAP = 'treemap',
  GITHUB_INTEGRATION = 'github_integration',
  EXTERNAL_APIS = 'external_apis',
  ADVANCED_TOOLTIPS = 'advanced_tooltips',
  ZOOM_FUNCTIONALITY = 'zoom_functionality',
  TAG_HIERARCHY = 'tag_hierarchy',
}

/**
 * Get the current visualization configuration with feature flags applied
 */
export function getVisualizationConfig(): VisualizationConfig {
  try {
    // Start with site metadata configuration
    const siteConfig = (siteMetadata as any)?.visualizations || {}

    // Merge with environment variables
    const envConfig = getConfigFromEnv()

    // Merge configurations with defaults
    const mergedConfig = mergeWithDefaults({
      ...siteConfig,
      ...envConfig,
    })

    // Validate the final configuration
    const validatedConfig = validateVisualizationConfig(mergedConfig)

    return validatedConfig
  } catch (error) {
    console.warn('Error loading visualization configuration, using defaults:', error)
    return mergeWithDefaults({})
  }
}

/**
 * Check if a specific visualization feature is enabled
 */
export function isFeatureEnabled(feature: VisualizationFeature): boolean {
  const config = getVisualizationConfig()

  switch (feature) {
    case VisualizationFeature.HEATMAP:
      return config.heatmap.enabled

    case VisualizationFeature.TREEMAP:
      return config.treemap.enabled

    case VisualizationFeature.GITHUB_INTEGRATION:
      return config.external.github?.enabled || false

    case VisualizationFeature.EXTERNAL_APIS:
      return Object.values(config.external).some((ext) => ext?.enabled)

    case VisualizationFeature.ADVANCED_TOOLTIPS:
      return config.heatmap.showTooltips

    case VisualizationFeature.ZOOM_FUNCTIONALITY:
      return config.treemap.enableZoom

    case VisualizationFeature.TAG_HIERARCHY:
      return config.treemap.hierarchical

    default:
      return false
  }
}

/**
 * Get enabled features as an array
 */
export function getEnabledFeatures(): VisualizationFeature[] {
  return Object.values(VisualizationFeature).filter((feature) => isFeatureEnabled(feature))
}

/**
 * Feature flag context for React components
 */
export interface FeatureFlagContext {
  isHeatmapEnabled: boolean
  isTreemapEnabled: boolean
  isGitHubIntegrationEnabled: boolean
  isExternalApisEnabled: boolean
  isAdvancedTooltipsEnabled: boolean
  isZoomFunctionalityEnabled: boolean
  isTagHierarchyEnabled: boolean
  config: VisualizationConfig
}

/**
 * Get feature flag context for React components
 */
export function getFeatureFlagContext(): FeatureFlagContext {
  const config = getVisualizationConfig()

  return {
    isHeatmapEnabled: isFeatureEnabled(VisualizationFeature.HEATMAP),
    isTreemapEnabled: isFeatureEnabled(VisualizationFeature.TREEMAP),
    isGitHubIntegrationEnabled: isFeatureEnabled(VisualizationFeature.GITHUB_INTEGRATION),
    isExternalApisEnabled: isFeatureEnabled(VisualizationFeature.EXTERNAL_APIS),
    isAdvancedTooltipsEnabled: isFeatureEnabled(VisualizationFeature.ADVANCED_TOOLTIPS),
    isZoomFunctionalityEnabled: isFeatureEnabled(VisualizationFeature.ZOOM_FUNCTIONALITY),
    isTagHierarchyEnabled: isFeatureEnabled(VisualizationFeature.TAG_HIERARCHY),
    config,
  }
}

/**
 * Runtime feature flag overrides (for testing or A/B testing)
 */
class FeatureFlagManager {
  private overrides: Map<VisualizationFeature, boolean> = new Map()

  /**
   * Override a feature flag at runtime
   */
  setFeatureOverride(feature: VisualizationFeature, enabled: boolean): void {
    this.overrides.set(feature, enabled)
  }

  /**
   * Remove a feature flag override
   */
  removeFeatureOverride(feature: VisualizationFeature): void {
    this.overrides.delete(feature)
  }

  /**
   * Clear all feature flag overrides
   */
  clearAllOverrides(): void {
    this.overrides.clear()
  }

  /**
   * Check if a feature is enabled, considering overrides
   */
  isFeatureEnabled(feature: VisualizationFeature): boolean {
    if (this.overrides.has(feature)) {
      return this.overrides.get(feature)!
    }
    return isFeatureEnabled(feature)
  }

  /**
   * Get all active overrides
   */
  getOverrides(): Record<string, boolean> {
    const result: Record<string, boolean> = {}
    this.overrides.forEach((enabled, feature) => {
      result[feature] = enabled
    })
    return result
  }
}

/**
 * Global feature flag manager instance
 */
export const featureFlagManager = new FeatureFlagManager()

/**
 * Development utilities for feature flag testing
 */
export const devUtils = {
  /**
   * Enable all visualization features (for development)
   */
  enableAllFeatures(): void {
    Object.values(VisualizationFeature).forEach((feature) => {
      featureFlagManager.setFeatureOverride(feature, true)
    })
  },

  /**
   * Disable all visualization features (for testing fallbacks)
   */
  disableAllFeatures(): void {
    Object.values(VisualizationFeature).forEach((feature) => {
      featureFlagManager.setFeatureOverride(feature, false)
    })
  },

  /**
   * Reset to configuration-based feature flags
   */
  resetToConfig(): void {
    featureFlagManager.clearAllOverrides()
  },

  /**
   * Get current feature flag status
   */
  getFeatureStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {}
    Object.values(VisualizationFeature).forEach((feature) => {
      status[feature] = featureFlagManager.isFeatureEnabled(feature)
    })
    return status
  },
}

/**
 * Conditional rendering helper for features
 */
export function withFeatureFlag<T>(
  feature: VisualizationFeature,
  component: T,
  fallback?: T
): T | null {
  if (featureFlagManager.isFeatureEnabled(feature)) {
    return component
  }
  return fallback || null
}

/**
 * Hook for accessing feature flags in React components
 */
export function useFeatureFlags() {
  // In a real implementation, this would use React context or state
  // For now, we'll return the current state
  return {
    ...getFeatureFlagContext(),
    isFeatureEnabled: (feature: VisualizationFeature) =>
      featureFlagManager.isFeatureEnabled(feature),
    setFeatureOverride: (feature: VisualizationFeature, enabled: boolean) =>
      featureFlagManager.setFeatureOverride(feature, enabled),
    removeFeatureOverride: (feature: VisualizationFeature) =>
      featureFlagManager.removeFeatureOverride(feature),
  }
}

/**
 * Build-time feature flag evaluation for optimization
 */
export function shouldIncludeFeatureInBuild(feature: VisualizationFeature): boolean {
  // Check if feature is permanently disabled in configuration
  const config = getVisualizationConfig()

  switch (feature) {
    case VisualizationFeature.HEATMAP:
      return config.heatmap.enabled

    case VisualizationFeature.TREEMAP:
      return config.treemap.enabled

    case VisualizationFeature.GITHUB_INTEGRATION:
      // Include if GitHub integration is configured, even if disabled
      return !!config.external.github

    default:
      return true // Include by default for other features
  }
}
