// Core TOC data structure
export interface TOCItem {
  value: string // Heading text
  url: string // Fragment identifier (#heading-id)
  depth: number // Heading level (2-6)
}

// TOC positioning options
export type TOCPosition = 'sidebar' | 'top' | 'floating'

// Responsive positioning configuration
export interface ResponsivePositioning {
  desktop: TOCPosition
  tablet: TOCPosition
  mobile: TOCPosition
}

// Main TableOfContents component props
export interface TableOfContentsProps {
  toc: TOCItem[]
  className?: string
  position?: TOCPosition | 'auto'
  minHeadings?: number
  maxDepth?: number
  showToggle?: boolean
  sticky?: boolean
}

// TOCContent component props
export interface TOCContentProps {
  items: TOCItem[]
  activeId: string | null
  onItemClick: (id: string) => void
  maxDepth: number
  className?: string
}

// TOCItem component props
export interface TOCItemProps {
  item: TOCItem
  isActive: boolean
  onClick: (id: string) => void
  className?: string
}

// TOCToggle component props
export interface TOCToggleProps {
  isOpen: boolean
  onToggle: () => void
  itemCount: number
  className?: string
}

// TOC configuration schema
export interface TOCConfig {
  enabled: boolean
  minHeadings: number
  maxDepth: number
  position: TOCPosition | 'auto'
  sticky: boolean
  showToggle: boolean
}

// Site-wide TOC settings (for siteMetadata)
export interface TOCSettings {
  toc?: {
    enabled: boolean
    minHeadings: number
    maxDepth: number
    position: TOCPosition | 'auto'
    sticky: boolean
    showToggle: boolean
  }
}

// Per-post TOC override (for frontmatter)
export interface PostTOCConfig {
  toc?:
    | boolean
    | {
        enabled: boolean
        position?: TOCPosition
        maxDepth?: number
        sticky?: boolean
      }
}

// Hook return types
export interface UseScrollSpyOptions {
  headingIds: string[]
  rootMargin?: string
  threshold?: number
}

export interface UseScrollSpyReturn {
  activeId: string | null
}

export interface UseResponsiveReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  tocPosition: TOCPosition
}

export interface UseTOCConfigReturn {
  config: TOCConfig
  shouldShowTOC: boolean
}
