# Table of Contents Feature

The Table of Contents (TOC) feature automatically generates navigation for blog posts based on heading elements (H1-H6). It provides a responsive, accessible, and customizable way for readers to navigate long-form content.

## Features

- **Automatic Generation**: TOC is automatically generated from heading elements in blog posts
- **Responsive Design**: Adapts to different screen sizes with appropriate positioning
- **Scroll Spy**: Highlights the currently visible section as users scroll
- **Smooth Scrolling**: Smooth navigation to sections when clicking TOC links
- **Accessibility**: Full keyboard navigation and screen reader support
- **Customizable**: Configurable through global settings and per-post overrides
- **Performance Optimized**: Lazy loading and optimized scroll event handling
- **Dark Mode**: Full support for light and dark themes

## Configuration

### Global Configuration

Add TOC settings to your `data/siteMetadata.js`:

```javascript
const siteMetadata = {
  // ... other settings
  toc: {
    enabled: true,        // Enable TOC globally
    minHeadings: 3,       // Minimum headings required to show TOC
    maxDepth: 6,          // Maximum heading depth (1-6)
    position: 'auto',     // 'auto', 'sidebar', 'top', or 'floating'
    sticky: true,         // Make TOC sticky when in sidebar/floating
    showToggle: false,    // Show toggle button (auto-enabled on mobile)
  },
}
```

### Per-Post Configuration

Override TOC settings in blog post frontmatter:

```yaml
---
title: "My Blog Post"
date: "2024-01-01"
# Disable TOC for this post
toc: false
---
```

Or with detailed configuration:

```yaml
---
title: "My Blog Post"
date: "2024-01-01"
# Custom TOC settings for this post
toc:
  enabled: true
  position: 'top'
  maxDepth: 4
  sticky: false
---
```

## Positioning Options

### Auto (Recommended)
- **Desktop**: Sidebar position with sticky behavior
- **Tablet**: Top position with toggle
- **Mobile**: Top position with toggle

### Sidebar
- Fixed position in left sidebar (desktop only)
- Sticky behavior follows scroll
- Best for long-form content

### Top
- Positioned at the top of content
- Collapsible on mobile devices
- Good for shorter posts

### Floating
- Fixed floating position on right side
- Desktop only (hidden on mobile/tablet)
- Minimal space usage

## Styling and Customization

### CSS Classes

The TOC uses a comprehensive set of CSS classes for styling:

```css
.table-of-contents     /* Main container */
.toc-sidebar          /* Sidebar positioning */
.toc-top              /* Top positioning */
.toc-floating         /* Floating positioning */
.toc-sticky           /* Sticky behavior */
.toc-title            /* TOC title */
.toc-content          /* List container */
.toc-item             /* Individual items */
.toc-link             /* Item links */
.toc-link-active      /* Active item */
.toc-toggle           /* Mobile toggle button */
```

### Depth-based Styling

Items are automatically styled based on heading depth:

```css
.toc-link-depth-1     /* H1 headings */
.toc-link-depth-2     /* H2 headings */
.toc-link-depth-3     /* H3 headings */
/* ... up to depth-6 */
```

### Dark Mode

All TOC styles include dark mode variants using Tailwind's dark mode classes.

## Accessibility Features

### Keyboard Navigation
- Full keyboard accessibility with Tab navigation
- Enter and Space key support for activation
- Proper focus management and indicators

### Screen Reader Support
- Semantic HTML structure with `nav`, `ul`, `li` elements
- ARIA labels and roles for enhanced screen reader experience
- `aria-current="location"` for active items
- Proper heading hierarchy and relationships

### Reduced Motion Support
- Respects `prefers-reduced-motion` user setting
- Disables animations when reduced motion is preferred
- Maintains functionality while reducing visual effects

## Performance Optimizations

### Lazy Loading
- TOC component can be lazy loaded for better initial page performance
- Loading states and error boundaries included

### Scroll Event Optimization
- Throttled scroll event handling
- Intersection Observer for efficient scroll spy
- React.memo and useMemo for preventing unnecessary re-renders

### Bundle Size
- Modular component structure
- Tree-shakeable exports
- Minimal runtime overhead

## Browser Support

- **Modern Browsers**: Full feature support
- **Intersection Observer**: Required for scroll spy (polyfill available)
- **Smooth Scrolling**: Graceful fallback for unsupported browsers
- **CSS Grid/Flexbox**: Required for responsive layouts

## Troubleshooting

### TOC Not Appearing
1. Check if post has minimum required headings (default: 3)
2. Verify TOC is enabled in global config and not disabled in frontmatter
3. Ensure headings have proper HTML structure

### Scroll Spy Not Working
1. Verify headings have unique IDs
2. Check for JavaScript errors in console
3. Ensure Intersection Observer is supported

### Styling Issues
1. Check if TOC CSS is properly imported
2. Verify Tailwind CSS classes are available
3. Check for CSS conflicts with existing styles

### Performance Issues
1. Use LazyTableOfContents for code splitting
2. Check for excessive re-renders in React DevTools
3. Verify scroll event throttling is working

## Advanced Usage

### Custom Components

You can create custom TOC implementations using the provided hooks:

```tsx
import { useScrollSpy, useResponsive, useTOCConfig } from '@/lib/hooks'
import { extractTOCFromDOM } from '@/lib/utils/extractTOC'

function CustomTOC({ postConfig }) {
  const { config } = useTOCConfig(postConfig)
  const { isMobile } = useResponsive()
  const toc = extractTOCFromDOM()
  const { activeId } = useScrollSpy({ 
    headingIds: toc.map(item => item.url.replace('#', ''))
  })
  
  // Custom implementation...
}
```

### Integration with Other Features

The TOC integrates seamlessly with:
- Search functionality (headings are searchable)
- Print styles (TOC is hidden when printing)
- Analytics (scroll tracking can be added)
- Comments (TOC scrolls to comment section)

## Migration Guide

### From Manual TOC
If you have manual TOC implementations:

1. Remove manual TOC code from posts
2. Add TOC configuration to siteMetadata
3. Update layouts to use new TOC component
4. Test responsive behavior and styling

### Updating Existing Posts
- No changes required to existing posts
- TOC will be automatically generated
- Add frontmatter overrides as needed

## API Reference

### Components

#### TableOfContents
Main TOC component with full functionality.

#### LazyTableOfContents  
Lazy-loaded version with loading states.

#### TOCContent
List rendering component (internal).

#### TOCItem
Individual item component (internal).

#### TOCToggle
Mobile toggle component (internal).

### Hooks

#### useScrollSpy
Tracks currently visible heading.

#### useResponsive
Detects screen size and appropriate positioning.

#### useTOCConfig
Parses and merges TOC configuration.

### Utilities

#### extractTOCFromDOM
Extracts TOC data from DOM elements.

#### smoothScrollToElement
Smooth scrolling with offset calculation.

#### calculateScrollOffset
Calculates offset for sticky headers.