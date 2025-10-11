# Table of Contents Configuration Examples

This document provides practical examples of TOC configuration for different use cases.

## Global Configuration Examples

### Basic Setup
```javascript
// data/siteMetadata.js
const siteMetadata = {
  // ... other settings
  toc: {
    enabled: true,
    minHeadings: 3,
    maxDepth: 6,
    position: 'auto',
    sticky: true,
    showToggle: false,
  },
}
```

### Documentation Site
```javascript
// Optimized for technical documentation
toc: {
  enabled: true,
  minHeadings: 2,        // Show TOC even with few headings
  maxDepth: 4,           // Limit depth for cleaner navigation
  position: 'sidebar',   // Always use sidebar
  sticky: true,
  showToggle: false,
}
```

### Blog with Short Posts
```javascript
// For blogs with mostly short posts
toc: {
  enabled: true,
  minHeadings: 4,        // Higher threshold
  maxDepth: 3,           // Shallow depth
  position: 'top',       // Top position for all devices
  sticky: false,
  showToggle: true,      // Always show toggle
}
```

### Mobile-First Blog
```javascript
// Optimized for mobile reading
toc: {
  enabled: true,
  minHeadings: 3,
  maxDepth: 6,
  position: 'auto',      // Responsive positioning
  sticky: false,         // No sticky on mobile
  showToggle: true,      // Always collapsible
}
```

## Per-Post Configuration Examples

### Disable TOC for Specific Posts
```yaml
---
title: "Short Announcement"
date: "2024-01-01"
toc: false
---
```

### Long-Form Article
```yaml
---
title: "Complete Guide to React Hooks"
date: "2024-01-01"
toc:
  enabled: true
  position: 'sidebar'
  maxDepth: 5
  sticky: true
---
```

### Tutorial with Many Sections
```yaml
---
title: "Step-by-Step Tutorial"
date: "2024-01-01"
toc:
  enabled: true
  position: 'floating'
  maxDepth: 3
  sticky: true
---
```

### Mobile-Optimized Post
```yaml
---
title: "Mobile-First Content"
date: "2024-01-01"
toc:
  enabled: true
  position: 'top'
  sticky: false
---
```

## Layout-Specific Examples

### PostLayout (Sidebar TOC)
```tsx
// layouts/PostLayout.tsx
{tocEnabled && shouldShowTOC(toc, tocConfig.minHeadings) && (
  <div className="pt-6 pb-6">
    <TableOfContents
      toc={toc}
      position={tocConfig.position}
      sticky={tocConfig.sticky}
      minHeadings={tocConfig.minHeadings}
      maxDepth={tocConfig.maxDepth}
      showToggle={tocConfig.showToggle}
      className="xl:sticky xl:top-16"
    />
  </div>
)}
```

### PostSimple (Top TOC)
```tsx
// layouts/PostSimple.tsx
{tocEnabled && shouldShowTOC(toc, tocConfig.minHeadings) && (
  <div className="pt-6 pb-6">
    <TableOfContents
      toc={toc}
      position={tocConfig.position === 'sidebar' ? 'top' : tocConfig.position}
      sticky={tocConfig.sticky}
      minHeadings={tocConfig.minHeadings}
      maxDepth={tocConfig.maxDepth}
      showToggle={tocConfig.showToggle || true}
      className="mb-8"
    />
  </div>
)}
```

## Custom Styling Examples

### Minimal TOC Style
```css
/* Custom minimal TOC styling */
.table-of-contents {
  @apply bg-transparent border-0 shadow-none;
}

.toc-title {
  @apply text-sm font-normal text-gray-600 dark:text-gray-400;
}

.toc-link {
  @apply text-xs py-1 px-2;
}
```

### Colorful TOC Style
```css
/* Colorful TOC with accent colors */
.table-of-contents {
  @apply bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20;
  @apply border-blue-200 dark:border-blue-700;
}

.toc-link-active {
  @apply text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30;
}
```

### Compact TOC Style
```css
/* Compact TOC for space-constrained layouts */
.table-of-contents {
  @apply text-sm;
}

.toc-title {
  @apply text-base mb-2 px-3 pt-3;
}

.toc-link {
  @apply py-1 px-3 text-xs;
}

.toc-link-depth-3,
.toc-link-depth-4,
.toc-link-depth-5,
.toc-link-depth-6 {
  @apply hidden; /* Hide deep nesting in compact mode */
}
```

## Advanced Configuration Patterns

### Conditional TOC Based on Content Type
```javascript
// In your layout component
const getTOCConfig = (content) => {
  const baseConfig = useTOCConfig(content.toc)
  
  // Adjust based on content type
  if (content.tags?.includes('tutorial')) {
    return {
      ...baseConfig.config,
      position: 'sidebar',
      maxDepth: 5,
    }
  }
  
  if (content.tags?.includes('quick-tip')) {
    return {
      ...baseConfig.config,
      enabled: false, // Disable for quick tips
    }
  }
  
  return baseConfig.config
}
```

### Dynamic TOC Based on Content Length
```javascript
// Adjust TOC settings based on content length
const getDynamicTOCConfig = (content, toc) => {
  const wordCount = content.body.raw.split(' ').length
  const baseConfig = useTOCConfig(content.toc)
  
  if (wordCount < 500) {
    // Short posts - disable TOC
    return { ...baseConfig.config, enabled: false }
  } else if (wordCount < 1500) {
    // Medium posts - top position
    return { ...baseConfig.config, position: 'top' }
  } else {
    // Long posts - sidebar with all features
    return { ...baseConfig.config, position: 'sidebar', sticky: true }
  }
}
```

### Category-Specific TOC Settings
```yaml
# In frontmatter for different categories
---
title: "API Reference"
category: "documentation"
toc:
  enabled: true
  position: 'sidebar'
  maxDepth: 6
  minHeadings: 2
---

---
title: "Quick Update"
category: "news"
toc: false
---

---
title: "Tutorial Series Part 1"
category: "tutorial"
toc:
  enabled: true
  position: 'floating'
  maxDepth: 4
  sticky: true
---
```

## Responsive Configuration Examples

### Desktop-First Approach
```javascript
toc: {
  enabled: true,
  minHeadings: 3,
  maxDepth: 6,
  position: 'sidebar',    // Default to sidebar
  sticky: true,
  showToggle: false,      // No toggle on desktop
}
```

### Mobile-First Approach
```javascript
toc: {
  enabled: true,
  minHeadings: 3,
  maxDepth: 4,           // Shallower on mobile
  position: 'top',       // Default to top
  sticky: false,         // No sticky on mobile
  showToggle: true,      // Always show toggle
}
```

### Hybrid Approach
```javascript
toc: {
  enabled: true,
  minHeadings: 3,
  maxDepth: 6,
  position: 'auto',      // Let component decide
  sticky: true,
  showToggle: false,     // Auto-enabled on mobile
}
```

## Integration Examples

### With Search
```tsx
// Add TOC headings to search index
const searchableContent = {
  ...postContent,
  headings: toc.map(item => ({
    text: item.value,
    level: item.depth,
    id: item.url.replace('#', ''),
  }))
}
```

### With Analytics
```tsx
// Track TOC interactions
const handleTOCClick = (id: string) => {
  // Analytics tracking
  gtag('event', 'toc_click', {
    heading_id: id,
    post_title: content.title,
  })
  
  // Smooth scroll
  smoothScrollToElement(id, offset)
}
```

### With Print Styles
```css
/* Hide TOC when printing */
@media print {
  .table-of-contents {
    display: none !important;
  }
}

/* Show TOC in print for reference documents */
@media print {
  .documentation .table-of-contents {
    display: block !important;
    position: static !important;
    box-shadow: none !important;
    border: 1px solid #000 !important;
    page-break-inside: avoid;
  }
}
```

## Testing Configuration

### Test Different Screen Sizes
```javascript
// Test responsive behavior
const testResponsive = () => {
  // Desktop
  window.resizeTo(1920, 1080)
  // Should show sidebar TOC
  
  // Tablet
  window.resizeTo(768, 1024)
  // Should show top TOC with toggle
  
  // Mobile
  window.resizeTo(375, 667)
  // Should show collapsible top TOC
}
```

### Test Configuration Overrides
```yaml
# Test post with all overrides
---
title: "Test Post"
toc:
  enabled: true
  position: 'floating'
  maxDepth: 3
  minHeadings: 2
  sticky: false
  showToggle: true
---
```

## Performance Considerations

### Lazy Loading Configuration
```tsx
// Use lazy loading for better performance
import { LazyTableOfContents } from '@/components/TableOfContents'

// In your layout
<LazyTableOfContents
  toc={toc}
  {...tocConfig}
  fallback={CustomLoadingComponent}
  errorFallback={CustomErrorComponent}
/>
```

### Optimized for Large Posts
```javascript
// For posts with many headings
toc: {
  enabled: true,
  minHeadings: 5,        // Higher threshold
  maxDepth: 3,           // Limit depth
  position: 'floating',  // Less intrusive
  sticky: true,
}
```