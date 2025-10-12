# Implementation Plan

- [x] 1. Create custom hook for scroll-based TOC visibility
  - Create `lib/hooks/useScrollTOCVisibility.ts` with TypeScript interfaces
  - Implement Intersection Observer setup with proper configuration
  - Implement state management for visibility and sticky positioning
  - Add cleanup logic for observer disconnection
  - Add browser support detection and fallback behavior
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 8.4, 8.5_

- [x] 2. Integrate hook into PostLayout component
  - [x] 2.1 Import the new `useScrollTOCVisibility` hook in `PostLayout.tsx`
    - Add import statement at the top of the file
    - _Requirements: 8.1, 8.3_

  - [x] 2.2 Initialize hook with appropriate parameters
    - Call hook with `showToc` as the enabled parameter
    - Destructure `backLinkRef` and `tocState` from hook return
    - _Requirements: 5.2, 5.3_

  - [x] 2.3 Attach ref to "Back to blog" link container
    - Add `ref={backLinkRef}` to the div wrapping the "Back to blog" link
    - Ensure the ref is attached to the correct element
    - _Requirements: 4.1, 4.2_

  - [x] 2.4 Update TOC container with conditional visibility classes
    - Add conditional className based on `tocState.shouldShowTOC`
    - Add conditional className based on `tocState.isSticky`
    - Implement smooth transition classes using Tailwind utilities
    - Add `pointer-events-none` when TOC is hidden
    - _Requirements: 1.3, 2.3, 2.4, 3.3, 3.5_

  - [x] 2.5 Ensure existing TOC functionality is preserved
    - Verify all existing props are passed to SkeletonTOC
    - Ensure TOC configuration logic remains unchanged
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.3_

- [x] 3. Add CSS transitions and styles
  - [x] 3.1 Add scroll-based visibility transition classes to `css/toc.css`
    - Create `.toc-scroll-hidden` class with opacity and transform
    - Create `.toc-scroll-visible` class with opacity and transform
    - Create `.toc-scroll-sticky` class for sticky positioning
    - Create `.toc-scroll-static` class for relative positioning
    - Add transition properties with appropriate duration and easing
    - _Requirements: 2.4, 3.5_

  - [x] 3.2 Add reduced motion support
    - Add `@media (prefers-reduced-motion: reduce)` query
    - Disable transitions and transforms for reduced motion
    - _Requirements: 7.3_

  - [x] 3.3 Ensure responsive behavior
    - Verify styles work across breakpoints (mobile, tablet, desktop)
    - Test that TOC doesn't overlap content on smaller screens
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 4. Add TypeScript type definitions
  - [x] 4.1 Create interface for scroll TOC visibility state
    - Define `ScrollTOCVisibilityState` interface with boolean properties
    - Add JSDoc comments for each property
    - _Requirements: 8.5_

  - [x] 4.2 Create interface for hook return type
    - Define `UseScrollTOCVisibilityReturn` interface
    - Include `backLinkRef` and `tocState` properties
    - _Requirements: 8.5_

  - [x] 4.3 Add type exports to hook file
    - Export all interfaces for use in other components
    - _Requirements: 8.5_

- [x] 5. Implement accessibility features
  - [x] 5.1 Add ARIA attributes to TOC container
    - Add `aria-hidden` attribute based on visibility state
    - Add `role="navigation"` to TOC container
    - Add `aria-label="Table of contents"` to TOC container
    - _Requirements: 7.1, 7.5_

  - [x] 5.2 Add ARIA attributes to back link container
    - Add `role="navigation"` to back link container
    - Add `aria-label="Blog navigation"` to back link container
    - _Requirements: 7.1, 7.5_

  - [x] 5.3 Verify keyboard navigation works correctly
    - Test that TOC links are keyboard-accessible when visible
    - Ensure focus management is not affected by visibility changes
    - Verify tab order remains logical
    - _Requirements: 7.2_

- [x] 6. Test and validate implementation
  - [x] 6.1 Test initial page load state
    - Verify TOC is hidden on page load
    - Verify "Back to blog" link is visible
    - Check that no console errors occur
    - _Requirements: 1.1, 1.2_

  - [x] 6.2 Test scroll down behavior
    - Scroll down until "Back to blog" link exits viewport
    - Verify TOC becomes visible smoothly
    - Verify TOC becomes sticky
    - Continue scrolling and verify TOC remains visible
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 6.3 Test scroll up behavior
    - Scroll up until "Back to blog" link enters viewport
    - Verify TOC loses sticky positioning
    - Verify TOC scrolls with content
    - Verify TOC hides when at top
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 6.4 Test responsive behavior across devices
    - Test on mobile viewport (< 768px)
    - Test on tablet viewport (768px - 1024px)
    - Test on desktop viewport (> 1024px)
    - Test viewport resize behavior
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 6.5 Test performance
    - Verify no layout shifts occur during transitions
    - Check that scroll performance is smooth (60 FPS)
    - Verify no memory leaks (observer cleanup)
    - _Requirements: 4.3, 4.4, 4.5, 7.4_

  - [x] 6.6 Test accessibility features
    - Test with screen reader (VoiceOver, NVDA, or JAWS)
    - Test keyboard navigation (Tab, Shift+Tab)
    - Test with reduced motion enabled
    - Verify ARIA attributes are correct
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [x] 6.7 Test edge cases
    - Test with TOC disabled in configuration
    - Test with insufficient headings for TOC
    - Test with very long TOC (many headings)
    - Test with very short content (no scrolling needed)
    - _Requirements: 5.2, 5.3_

- [x] 7. Documentation and cleanup
  - [x] 7.1 Add JSDoc comments to hook
    - Document hook purpose and usage
    - Document parameters and return values
    - Add usage examples
    - _Requirements: 8.1, 8.2_

  - [x] 7.2 Add inline comments for complex logic
    - Comment Intersection Observer setup
    - Comment state transition logic
    - Comment cleanup logic
    - _Requirements: 8.1, 8.2_

  - [x] 7.3 Verify code follows project conventions
    - Check TypeScript usage is consistent
    - Verify Tailwind CSS usage follows patterns
    - Ensure file structure matches project organization
    - _Requirements: 8.1, 8.6_

  - [x] 7.4 Run linting and formatting
    - Run ESLint and fix any issues
    - Run Prettier to format code
    - Verify no TypeScript errors
    - _Requirements: 8.1_
