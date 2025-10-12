# Design Document

## Overview

This design implements author activity visualizations for the blog's about page using modern web visualization libraries. The solution provides two main components: a GitHub-style activity heatmap and a zoomable treemap for tag distribution, both optimized for performance and responsive design.

## Research Findings

### Activity Heatmap Libraries

**1. Cal-Heatmap (Recommended)**
- Lightweight (~15KB gzipped)
- GitHub-style calendar heatmaps
- Excellent TypeScript support
- Highly customizable
- Built-in tooltip support
- Responsive design

**2. React Activity Calendar**
- React-specific implementation
- GitHub-style interface
- Good documentation
- ~8KB bundle size

**3. D3.js Custom Implementation**
- Maximum flexibility
- Larger bundle size (~30KB+)
- Requires more development time
- Better for complex customizations

**4. GitHub-Calendar (External Script)**
- Direct GitHub integration
- Minimal setup
- Limited to GitHub data only
- External dependency

### Treemap Visualization Libraries

**1. Observable Plot (Recommended)**
- Modern, lightweight (~25KB)
- Excellent TypeScript support
- Built-in responsive design
- Grammar of graphics approach
- Good performance

**2. D3.js Hierarchy**
- Most flexible
- Larger bundle (~40KB+)
- Requires custom implementation
- Industry standard

**3. Recharts**
- React-focused
- Good documentation
- ~45KB bundle size
- Limited treemap customization

**4. Nivo**
- Comprehensive chart library
- React components
- ~60KB+ bundle size
- Good treemap support

## Architecture

### Component Structure

```
components/
├── ActivityVisualizations/
│   ├── index.tsx                 # Main container component
│   ├── ActivityHeatmap.tsx       # Heatmap visualization
│   ├── TagTreemap.tsx           # Treemap visualization
│   ├── VisualizationConfig.tsx  # Configuration interface
│   └── types.ts                 # TypeScript definitions
├── ui/
│   ├── Tooltip.tsx              # Shared tooltip component
│   └── LoadingSpinner.tsx       # Loading states
```

### Data Processing Pipeline

```
lib/
├── visualizations/
│   ├── activityData.ts          # Process blog posts for heatmap
│   ├── tagData.ts               # Process tags for treemap
│   ├── dataCache.ts             # Build-time data caching
│   └── externalIntegrations.ts  # GitHub/external API integration
```

### Configuration Schema

```typescript
interface VisualizationConfig {
  heatmap: {
    enabled: boolean
    weeksToShow: number
    colorScheme: 'github' | 'custom'
    customColors?: string[]
    showTooltips: boolean
  }
  treemap: {
    enabled: boolean
    hierarchical: boolean
    tagHierarchy?: Record<string, string[]>
    colorScheme: 'category' | 'frequency' | 'custom'
    customColors?: string[]
    enableZoom: boolean
    linkToTagPages: boolean
  }
  external: {
    github?: {
      enabled: boolean
      username: string
      token?: string
      includePrivate: boolean
    }
  }
}
```

## Components and Interfaces

### ActivityHeatmap Component

```typescript
interface ActivityHeatmapProps {
  data: ActivityData[]
  config: VisualizationConfig['heatmap']
  className?: string
}

interface ActivityData {
  date: string // ISO date string
  count: number
  posts?: {
    title: string
    slug: string
  }[]
}
```

**Implementation Details:**
- Uses Cal-Heatmap library for rendering
- Processes blog post dates into weekly grid format
- Supports custom color schemes matching site theme
- Implements hover tooltips with post details
- Responsive breakpoints for mobile optimization

### TagTreemap Component

```typescript
interface TagTreemapProps {
  data: TagData[]
  config: VisualizationConfig['treemap']
  className?: string
}

interface TagData {
  name: string
  count: number
  category?: string
  children?: TagData[]
  color?: string
}
```

**Implementation Details:**
- Uses Observable Plot for treemap rendering
- Supports hierarchical tag organization
- Implements zoom functionality for nested categories
- Click handlers for navigation to tag pages
- Dynamic color assignment based on category or frequency

### Data Processing Functions

```typescript
// lib/visualizations/activityData.ts
export function generateActivityData(posts: Blog[]): ActivityData[] {
  // Group posts by publication date
  // Calculate weekly activity patterns
  // Handle timezone considerations
}

// lib/visualizations/tagData.ts
export function generateTagData(posts: Blog[], hierarchy?: TagHierarchy): TagData[] {
  // Aggregate tag usage across posts
  // Build hierarchical structure if configured
  // Calculate relative sizes and colors
}
```

## Data Models

### Activity Data Schema

```typescript
interface WeeklyActivity {
  week: string // ISO week string (YYYY-Www)
  days: DayActivity[]
}

interface DayActivity {
  date: string
  count: number
  intensity: 0 | 1 | 2 | 3 | 4 // GitHub-style intensity levels
  posts: PostSummary[]
}

interface PostSummary {
  title: string
  slug: string
  tags: string[]
}
```

### Tag Hierarchy Schema

```typescript
interface TagHierarchy {
  [category: string]: {
    tags: string[]
    color?: string
    subcategories?: TagHierarchy
  }
}

// Example configuration
const defaultHierarchy: TagHierarchy = {
  'Technology': {
    tags: ['React', 'TypeScript', 'Next.js'],
    subcategories: {
      'Frontend': {
        tags: ['React', 'CSS', 'JavaScript']
      },
      'Backend': {
        tags: ['Node.js', 'API', 'Database']
      }
    }
  },
  'Computer Science': {
    tags: ['Algorithms', 'Data Structures', 'System Design']
  }
}
```

## Error Handling

### Graceful Degradation Strategy

1. **JavaScript Disabled**: Display static fallback content with basic statistics
2. **Library Load Failure**: Show text-based activity summary
3. **Data Processing Errors**: Display error message with retry option
4. **External API Failures**: Fall back to local blog data only
5. **Performance Issues**: Implement lazy loading and data pagination

### Error Boundaries

```typescript
interface VisualizationErrorBoundary {
  fallback: React.ComponentType<{error: Error}>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}
```

## Testing Strategy

### Unit Tests
- Data processing functions
- Component rendering with various props
- Configuration validation
- Error handling scenarios

### Integration Tests
- Full visualization rendering
- Theme switching behavior
- Responsive design breakpoints
- External API integration

### Performance Tests
- Bundle size impact measurement
- Rendering performance with large datasets
- Memory usage monitoring
- Build time impact assessment

## Performance Considerations

### Bundle Size Optimization
- Tree-shake unused library features
- Lazy load visualization components
- Use dynamic imports for heavy libraries
- Implement code splitting by visualization type

### Runtime Performance
- Pre-compute data at build time
- Use React.memo for expensive components
- Implement virtual scrolling for large datasets
- Cache processed data in localStorage

### Build Time Optimization
- Generate visualization data during build
- Cache external API responses
- Parallelize data processing
- Implement incremental data updates

## Accessibility

### WCAG Compliance
- Provide alternative text for visual elements
- Ensure sufficient color contrast ratios
- Support keyboard navigation
- Implement screen reader announcements

### Inclusive Design
- Color-blind friendly palettes
- High contrast mode support
- Reduced motion preferences
- Scalable text and UI elements

## Security Considerations

### External API Integration
- Secure token storage (environment variables)
- Rate limiting implementation
- Input validation for external data
- CORS configuration for API calls

### Data Privacy
- No personal information in visualizations
- Optional external integrations
- Clear data source attribution
- User consent for external data fetching

## Migration and Deployment

### Implementation Phases

**Phase 1: Core Infrastructure**
- Set up data processing pipeline
- Implement basic heatmap component
- Add configuration system

**Phase 2: Enhanced Features**
- Add treemap visualization
- Implement responsive design
- Add theme support

**Phase 3: External Integration**
- GitHub API integration
- Performance optimization
- Advanced configuration options

### Rollback Strategy
- Feature flags for each visualization
- Graceful degradation to existing about page
- Database migration scripts if needed
- Configuration validation and defaults