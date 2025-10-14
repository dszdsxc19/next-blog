# Activity Visualizations Configuration Guide

This guide explains how to configure and customize the activity visualizations feature in your blog.

## Overview

The activity visualizations feature provides two main components:
- **Activity Heatmap**: GitHub-style calendar showing your posting activity
- **Tag Treemap**: Interactive visualization of your content topics and categories

## Basic Configuration

### Site Metadata Configuration

Add the following configuration to your `data/siteMetadata.js` file:

```javascript
module.exports = {
  // ... other configuration
  visualizations: {
    // Activity heatmap configuration
    heatmap: {
      enabled: true,              // Enable/disable the heatmap
      weeksToShow: 52,           // Number of weeks to display (1 year)
      colorScheme: 'github',     // 'github' or 'custom'
      showTooltips: true,        // Show tooltips on hover
      // Optional: Custom colors for the heatmap
      // customColors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
    },
    
    // Tag treemap configuration
    treemap: {
      enabled: true,             // Enable/disable the treemap
      hierarchical: true,        // Use hierarchical tag organization
      colorScheme: 'category',   // 'category', 'frequency', or 'custom'
      enableZoom: true,          // Allow zooming into categories
      linkToTagPages: true,      // Link tags to their respective pages
      
      // Optional: Define tag hierarchy
      tagHierarchy: {
        'Technology': ['react', 'vue', 'javascript', 'typescript'],
        'Computer Science': ['algorithm', 'data-structure', 'system-design'],
        'Web Development': ['frontend', 'backend', 'ui', 'ux'],
        'Learning': ['tutorial', 'guide', 'tips', 'best-practices']
      }
    },
    
    // External integrations (optional)
    external: {
      // GitHub integration for commit activity
      // github: {
      //   enabled: false,
      //   username: 'your-github-username',
      //   includePrivate: false
      // }
    }
  }
}
```

## Configuration Options

### Heatmap Configuration

| Option         | Type     | Default     | Description                            |
| -------------- | -------- | ----------- | -------------------------------------- |
| `enabled`      | boolean  | `true`      | Enable or disable the activity heatmap |
| `weeksToShow`  | number   | `52`        | Number of weeks to display (1-104)     |
| `colorScheme`  | string   | `'github'`  | Color scheme: `'github'` or `'custom'` |
| `customColors` | string[] | `undefined` | Array of custom colors (hex, rgb, hsl) |
| `showTooltips` | boolean  | `true`      | Show tooltips on hover                 |

#### Color Schemes

**GitHub Scheme** (Light Mode):
- `#ebedf0` - No activity
- `#9be9a8` - Low activity
- `#40c463` - Medium activity
- `#30a14e` - High activity
- `#216e39` - Very high activity

**GitHub Scheme** (Dark Mode):
- `#161b22` - No activity
- `#0e4429` - Low activity
- `#006d32` - Medium activity
- `#26a641` - High activity
- `#39d353` - Very high activity

### Treemap Configuration

| Option           | Type     | Default      | Description                                              |
| ---------------- | -------- | ------------ | -------------------------------------------------------- |
| `enabled`        | boolean  | `true`       | Enable or disable the tag treemap                        |
| `hierarchical`   | boolean  | `true`       | Use hierarchical tag organization                        |
| `colorScheme`    | string   | `'category'` | Color scheme: `'category'`, `'frequency'`, or `'custom'` |
| `customColors`   | string[] | `undefined`  | Array of custom colors                                   |
| `enableZoom`     | boolean  | `true`       | Allow zooming into categories                            |
| `linkToTagPages` | boolean  | `true`       | Make tags clickable (link to tag pages)                  |
| `tagHierarchy`   | object   | `undefined`  | Define tag categories and hierarchies                    |

#### Tag Hierarchy Structure

```javascript
tagHierarchy: {
  'Category Name': ['tag1', 'tag2', 'tag3'],
  'Another Category': {
    tags: ['tag4', 'tag5'],
    subcategories: {
      'Subcategory': ['tag6', 'tag7']
    }
  }
}
```

## Environment Variables

You can override configuration using environment variables:

```bash
# Heatmap configuration
NEXT_PUBLIC_HEATMAP_ENABLED=true
NEXT_PUBLIC_HEATMAP_WEEKS=52

# Treemap configuration
NEXT_PUBLIC_TREEMAP_ENABLED=true

# GitHub integration (optional)
NEXT_PUBLIC_GITHUB_INTEGRATION=false
GITHUB_USERNAME=your-username
GITHUB_TOKEN=your-personal-access-token
GITHUB_INCLUDE_PRIVATE=false
```

## Advanced Configuration

### Custom Color Schemes

#### Heatmap Custom Colors
```javascript
heatmap: {
  colorScheme: 'custom',
  customColors: [
    '#f0f0f0',  // No activity
    '#c6e48b',  // Low activity
    '#7bc96f',  // Medium activity
    '#239a3b',  // High activity
    '#196127'   // Very high activity
  ]
}
```

#### Treemap Custom Colors
```javascript
treemap: {
  colorScheme: 'custom',
  customColors: [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ]
}
```

### Feature Flags

You can programmatically control features using the feature flag system:

```javascript
import { featureFlagManager, VisualizationFeature } from '@/lib/visualizations/featureFlags'

// Enable/disable features at runtime
featureFlagManager.setFeatureOverride(VisualizationFeature.HEATMAP, false)
featureFlagManager.setFeatureOverride(VisualizationFeature.TREEMAP, true)

// Check if a feature is enabled
const isHeatmapEnabled = featureFlagManager.isFeatureEnabled(VisualizationFeature.HEATMAP)
```

## Configuration Presets

Use predefined configuration presets for common use cases:

```javascript
import { CONFIG_PRESETS, mergeWithDefaults } from '@/lib/visualizations/config'

// Minimal configuration (heatmap only)
const minimalConfig = mergeWithDefaults({}, 'minimal')

// Standard configuration (default)
const standardConfig = mergeWithDefaults({}, 'standard')

// Comprehensive configuration (all features)
const comprehensiveConfig = mergeWithDefaults({}, 'comprehensive')
```

## Troubleshooting

### Common Issues

1. **Visualizations not showing**
   - Check that `enabled: true` in configuration
   - Verify blog posts have valid dates and tags
   - Check browser console for errors

2. **Heatmap appears empty**
   - Ensure blog posts have `date` field in frontmatter
   - Check date format (should be YYYY-MM-DD or ISO string)
   - Verify posts are not marked as `draft: true`

3. **Treemap shows no data**
   - Ensure blog posts have `tags` field in frontmatter
   - Check that tags are not empty arrays
   - Verify tag hierarchy configuration if using hierarchical mode

4. **Performance issues**
   - Reduce `weeksToShow` for heatmap
   - Limit number of tags or use tag hierarchy
   - Enable lazy loading (enabled by default)

### Debug Mode

Enable debug mode in development:

```javascript
// In your component
import { devUtils } from '@/lib/visualizations/featureFlags'

// Get current feature status
console.log(devUtils.getFeatureStatus())

// Enable all features for testing
devUtils.enableAllFeatures()
```

## Accessibility

The visualizations include comprehensive accessibility features:

- Screen reader support with ARIA labels
- Keyboard navigation (Ctrl/Cmd + H for heatmap, Ctrl/Cmd + T for treemap)
- High contrast mode support
- Text alternatives for visual content
- Color contrast compliance (WCAG AA/AAA)

### Accessibility Controls

Users can toggle accessibility features:
- Text alternative view
- High contrast mode
- Reduced motion support

## Performance Optimization

### Build-time Optimization

Data is generated at build time for optimal performance:
- Activity data is pre-computed from blog posts
- Tag data is aggregated and cached
- JSON files are generated for client-side loading

### Runtime Optimization

- Lazy loading with intersection observer
- Code splitting for visualization libraries
- Responsive design with mobile optimization
- Error boundaries for graceful degradation

## Integration Examples

### Custom Layout Integration

```jsx
import { ActivityVisualizationsContainer } from '@/components/ActivityVisualizations/ActivityVisualizationsContainer'

export default function CustomLayout({ children }) {
  return (
    <div>
      {children}
      <ActivityVisualizationsContainer />
    </div>
  )
}
```

### Conditional Rendering

```jsx
import { useFeatureFlags } from '@/lib/visualizations/featureFlags'

export default function ConditionalVisualizations() {
  const { isHeatmapEnabled, isTreemapEnabled } = useFeatureFlags()
  
  if (!isHeatmapEnabled && !isTreemapEnabled) {
    return null
  }
  
  return <ActivityVisualizationsContainer />
}
```

## Migration Guide

### From Version 1.x to 2.x

1. Update configuration structure in `siteMetadata.js`
2. Replace old component imports
3. Update custom styling classes
4. Test accessibility features

### Breaking Changes

- Configuration structure has changed
- Component props have been updated
- CSS classes have been renamed for consistency

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify configuration against examples
4. Check that all dependencies are installed

## Examples

See the `examples/` directory for complete configuration examples:
- Basic setup
- Advanced customization
- Custom themes
- Performance optimization