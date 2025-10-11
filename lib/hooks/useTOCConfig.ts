'use client'

import { useMemo } from 'react'
import { TOCConfig, PostTOCConfig, UseTOCConfigReturn } from '@/types/toc'
import siteMetadata from '@/data/siteMetadata'

/**
 * Hook to parse and merge TOC configuration from global settings and post frontmatter
 */
export const useTOCConfig = (postTOCConfig?: PostTOCConfig['toc']): UseTOCConfigReturn => {
  const config = useMemo(() => {
    // Default configuration
    const defaultConfig: TOCConfig = {
      enabled: true,
      minHeadings: 3,
      maxDepth: 6,
      position: 'auto',
      sticky: true,
      showToggle: false,
    }

    // Global site configuration
    const globalConfig = siteMetadata.toc || {}

    // Merge default with global config
    const mergedConfig: TOCConfig = {
      ...defaultConfig,
      ...globalConfig,
    }

    // Handle post-specific overrides
    if (postTOCConfig !== undefined) {
      if (typeof postTOCConfig === 'boolean') {
        // Simple boolean override
        mergedConfig.enabled = postTOCConfig
      } else if (typeof postTOCConfig === 'object' && postTOCConfig !== null) {
        // Object-based override
        Object.assign(mergedConfig, postTOCConfig)
      }
    }

    return mergedConfig
  }, [postTOCConfig])

  const shouldShowTOC = useMemo(() => {
    return config.enabled
  }, [config.enabled])

  return {
    config,
    shouldShowTOC,
  }
}

/**
 * Validate TOC configuration object
 */
export const validateTOCConfig = (config: Partial<TOCConfig>): TOCConfig => {
  const validatedConfig: TOCConfig = {
    enabled: typeof config.enabled === 'boolean' ? config.enabled : true,
    minHeadings:
      typeof config.minHeadings === 'number' && config.minHeadings >= 1 ? config.minHeadings : 3,
    maxDepth:
      typeof config.maxDepth === 'number' && config.maxDepth >= 1 && config.maxDepth <= 6
        ? config.maxDepth
        : 6,
    position:
      config.position === 'sidebar' || config.position === 'top' || config.position === 'floating'
        ? config.position
        : 'auto',
    sticky: typeof config.sticky === 'boolean' ? config.sticky : true,
    showToggle: typeof config.showToggle === 'boolean' ? config.showToggle : false,
  }

  return validatedConfig
}
