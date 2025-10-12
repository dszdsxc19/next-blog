# Design Document

## Overview

This design document outlines the implementation approach for adding scroll-based visibility control to the Table of Contents (TOC) in blog post layouts. The solution uses the Intersection Observer API to detect when the "Back to the blog" link enters or exits the viewport, triggering smooth transitions between hidden, visible-sticky, and visible-scrolling states.

## Architecture

### High-Level Flow

```
Page Load → TOC Hidden
    ↓
User Scrolls Down → "Back to blog" exits viewport
    ↓
TOC Becomes Visible + Sticky
    ↓
User Scrolls Up → "Back to blog" enters viewport
    ↓
TOC Loses Sticky → Scrolls with content → Hides
    ↓
Reaches Top → TOC Hidden
```

### Component Structure

```
PostLayout.tsx (Modified)
├── useScrollTOCVisibility (New Custom Hook)
│   ├── Intersection Observer setup
│   ├── Scroll state management
│   └── Cleanup logic
├── "Back to blog" link (Observation Target)
│   └── ref={backLinkRef}
└── TOC Container (Modified)
    ├── Conditional visibility classes
    ├── Dynamic sticky/static positioning
    └── Smooth transitions
```

## Components and Interfaces

### 1. Custom Hook: `useScrollTOCVisibility`

**Location:** `lib/hooks/useScrollTOCVisibility.ts`

**Purpose:** Encapsulates scroll detection logic and TOC visibility state management.

**Interface:**
```typescript
interface ScrollTOCVisibilityState {
  isBackLinkVisible: boolean
  shouldShowTOC: boolean
  isSticky: boolean
}

interface UseScrollTOCVisibilityReturn {
  backLinkRef: RefObject<HTMLDivElement>
  tocState: ScrollTOCVisibilityState
}

function useScrollTOCVisibility(
  enabled: boolean
): UseScrollTOCVisibilityReturn
```

**State Management:**
- `isBackLinkVisible`: Boolean tracking if "Back to blog" link is in viewport
- `shouldShowTOC`: Boolean determining if TOC should be visible
- `isSticky`: Boolean determining if TOC should use sticky positioning

**Logic:**
```typescript
// State transitions
if (isBackLinkVisible) {
  shouldShowTOC = false
  isSticky = false
} else {
  shouldShowTOC = true
  isSticky = true
}
```

**Implementation Details:**
```typescript
export function useScrollTOCVisibility(enabled: boolean = true) {
  const backLinkRef = useRef<HTMLDivElement>(null)
  const [isBackLinkVisible, setIsBackLinkVisible] = useState(true)
  
  useEffect(() => {
    if (!enabled || !backLinkRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsBackLinkVisible(entry.isIntersecting)
        })
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    )

    observer.observe(backLinkRef.current)

    return () => observer.disconnect()
  }, [enabled])

  return {
    backLinkRef,
    tocState: {
      isBackLinkVisible,
      shouldShowTOC: !isBackLinkVisible,
      isSticky: !isBackLinkVisible
    }
  }
}
```

### 2. Modified Component: `PostLayout.tsx`

**Changes Required:**

1. **Import new hook:**
```typescript
import { useScrollTOCVisibility } from '@/lib/hooks/useScrollTOCVisibility'
```

2. **Use hook in component:**
```typescript
const { backLinkRef, tocState } = useScrollTOCVisibility(showToc)
```

3. **Attach ref to "Back to blog" link container:**
```typescript
<div ref={backLinkRef} className="pt-4 xl:pt-8">
  <Link
    href={`/${basePath}`}
    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    aria-label="Back to the blog"
  >
    &larr; Back to the blog
  </Link>
</div>
```

4. **Update TOC container with conditional classes:**
```typescript
{showToc && (
  <div className="pt-8 xl:min-h-screen">
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${tocState.shouldShowTOC ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        ${tocState.isSticky ? 'sticky top-8' : 'relative'}
        max-h-[calc(100vh-4rem)]
      `}
    >
      <SkeletonTOC
        toc={toc}
        minHeadings={tocConfig.minHeadings}
        maxDepth={tocConfig.maxDepth}
      />
    </div>
  </div>
)}
```

### 3. CSS Transitions

**Location:** `css/toc.css` (additions)

**New Classes:**
```css
/* Scroll-based visibility transitions */
.toc-scroll-hidden {
  @apply opacity-0 -translate-y-4 pointer-events-none;
  @apply transition-all duration-300 ease-in-out;
}

.toc-scroll-visible {
  @apply opacity-100 translate-y-0;
  @apply transition-all duration-300 ease-in-out;
}

.toc-scroll-sticky {
  @apply sticky top-8;
}

.toc-scroll-static {
  @apply relative;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .toc-scroll-hidden,
  .toc-scroll-visible {
    transition: none !important;
    transform: none !important;
  }
}
```

## Data Models

### TOC Visibility State

```typescript
interface ScrollTOCVisibilityState {
  // Whether the "Back to blog" link is currently visible in viewport
  isBackLinkVisible: boolean
  
  // Whether TOC should be displayed (opposite of isBackLinkVisible)
  shouldShowTOC: boolean
  
  // Whether TOC should use sticky positioning
  isSticky: boolean
}
```

### Hook Configuration

```typescript
interface ScrollTOCConfig {
  // Enable/disable scroll-based visibility
  enabled: boolean
  
  // Intersection Observer options
  observerOptions?: IntersectionObserverInit
}
```

## Error Handling

### Intersection Observer Support

```typescript
// Check for browser support
if (typeof IntersectionObserver === 'undefined') {
  console.warn('IntersectionObserver not supported, TOC will remain visible')
  return {
    backLinkRef,
    tocState: {
      isBackLinkVisible: false,
      shouldShowTOC: true,
      isSticky: true
    }
  }
}
```

### Ref Not Attached

```typescript
// Guard against missing ref
if (!enabled || !backLinkRef.current) {
  return // Observer won't be created
}
```

### Cleanup

```typescript
// Ensure observer is disconnected on unmount
return () => {
  if (observer) {
    observer.disconnect()
  }
}
```

## Testing Strategy

### Unit Tests

1. **Hook Tests** (`useScrollTOCVisibility.test.ts`):
   - Test initial state (TOC hidden)
   - Test state changes when link visibility changes
   - Test cleanup on unmount
   - Test disabled state

2. **Component Tests** (`PostLayout.test.tsx`):
   - Test TOC visibility on page load
   - Test TOC appears when scrolling down
   - Test TOC hides when scrolling up
   - Test sticky positioning changes

### Integration Tests

1. **Scroll Behavior**:
   - Simulate scroll events
   - Verify Intersection Observer callbacks
   - Test state transitions

2. **Accessibility**:
   - Test keyboard navigation
   - Test screen reader announcements
   - Test reduced motion preferences

### Manual Testing Checklist

- [ ] TOC hidden on page load
- [ ] TOC appears smoothly when "Back to blog" scrolls out
- [ ] TOC becomes sticky when visible
- [ ] TOC hides when scrolling back to top
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Smooth transitions
- [ ] No layout shifts
- [ ] Performance is good (no jank)
- [ ] Works with keyboard navigation
- [ ] Works with screen readers
- [ ] Respects reduced motion preferences

## Performance Considerations

### Intersection Observer Benefits

- **Efficient**: Native browser API, no manual scroll event listeners
- **Performant**: Runs off main thread
- **Battery-friendly**: Only fires when intersection changes

### Optimization Strategies

1. **Debouncing**: Not needed with Intersection Observer (built-in)
2. **Threshold**: Use `threshold: 0` for immediate detection
3. **Root Margin**: Use `rootMargin: '0px'` for precise viewport detection
4. **Cleanup**: Always disconnect observer on unmount

### Performance Metrics

- **Target**: < 16ms per frame (60 FPS)
- **Intersection Observer overhead**: < 1ms
- **State update overhead**: < 1ms
- **CSS transition**: Hardware-accelerated (transform, opacity)

## Accessibility

### ARIA Attributes

```typescript
<div
  ref={backLinkRef}
  className="pt-4 xl:pt-8"
  role="navigation"
  aria-label="Blog navigation"
>
  {/* Back to blog link */}
</div>

<div
  className={/* visibility classes */}
  role="navigation"
  aria-label="Table of contents"
  aria-hidden={!tocState.shouldShowTOC}
>
  <SkeletonTOC {...props} />
</div>
```

### Keyboard Navigation

- TOC links remain keyboard-accessible when visible
- Focus management not affected by visibility changes
- Tab order remains logical

### Screen Reader Support

- `aria-hidden` attribute updates with visibility
- No announcements for automatic visibility changes
- TOC remains discoverable when visible

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .toc-scroll-hidden,
  .toc-scroll-visible {
    transition: none !important;
    transform: none !important;
  }
}
```

## Browser Compatibility

### Intersection Observer Support

- **Chrome**: 51+
- **Firefox**: 55+
- **Safari**: 12.1+
- **Edge**: 15+

### Fallback Strategy

If Intersection Observer is not supported:
- TOC remains visible and sticky (current behavior)
- No scroll-based visibility changes
- Console warning logged

## Migration and Rollout

### Backward Compatibility

- Feature is additive, no breaking changes
- Existing TOC configuration options remain unchanged
- Can be disabled by setting `enabled: false` in hook

### Rollout Plan

1. **Phase 1**: Implement hook and test in isolation
2. **Phase 2**: Integrate into PostLayout with feature flag
3. **Phase 3**: Test across devices and browsers
4. **Phase 4**: Enable by default

### Feature Flag (Optional)

```typescript
// In siteMetadata.js
export default {
  // ... other config
  features: {
    scrollBasedTOC: true // Enable/disable feature
  }
}

// In PostLayout.tsx
const scrollTOCEnabled = siteMetadata.features?.scrollBasedTOC ?? true
const { backLinkRef, tocState } = useScrollTOCVisibility(showToc && scrollTOCEnabled)
```

## Alternative Approaches Considered

### 1. Scroll Event Listener

**Pros:**
- More control over scroll position
- Can implement custom thresholds

**Cons:**
- Performance overhead (runs on main thread)
- Requires debouncing/throttling
- More complex cleanup

**Decision:** Rejected in favor of Intersection Observer for better performance.

### 2. CSS-Only Solution

**Pros:**
- No JavaScript required
- Potentially simpler

**Cons:**
- Cannot detect "Back to blog" link visibility
- Limited control over state transitions
- Browser support issues

**Decision:** Rejected because CSS cannot detect element visibility in viewport.

### 3. Scroll Position Calculation

**Pros:**
- Direct control over scroll thresholds

**Cons:**
- Requires manual position calculations
- Performance overhead
- Fragile (breaks with layout changes)

**Decision:** Rejected in favor of Intersection Observer for robustness.

## Open Questions

1. **Should we add a delay before hiding TOC when scrolling up?**
   - Current design: Immediate hide when "Back to blog" enters viewport
   - Alternative: Add 200ms delay to prevent flickering
   - **Decision**: Start with immediate, add delay if needed based on user feedback

2. **Should TOC visibility be persisted in localStorage?**
   - Current design: Always starts hidden
   - Alternative: Remember user's last state
   - **Decision**: No persistence for now, keep behavior predictable

3. **Should we add a manual toggle button?**
   - Current design: Fully automatic based on scroll
   - Alternative: Add button to override automatic behavior
   - **Decision**: No manual toggle, keep it simple and automatic

## Future Enhancements

1. **Smooth scroll to TOC**: When TOC appears, optionally scroll it into view
2. **TOC preview on hover**: Show mini TOC when hovering over "Back to blog" link
3. **Customizable thresholds**: Allow configuration of when TOC appears/hides
4. **Animation variants**: Different transition styles (slide, fade, scale)
5. **Mobile-specific behavior**: Different behavior for touch devices
