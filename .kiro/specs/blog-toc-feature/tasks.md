# Implementation Plan

- [-] 1. Set up project structure and core interfaces
  - Create directory structure for TOC components
  - Define TypeScript interfaces for TOC data and configuration
  - Set up basic component files with proper exports
  - _Requirements: 1.1, 7.1_

- [x] 1.1 Create TOC component directory structure
  - Create `components/TableOfContents/` directory
  - Create index.ts file for clean exports
  - Set up component file structure (TableOfContents.tsx, TOCContent.tsx, TOCItem.tsx, TOCToggle.tsx)
  - _Requirements: 1.1_

- [-] 1.2 Define TypeScript interfaces and types
  - Create `types/toc.ts` with TOCItem, TableOfContentsProps, and configuration interfaces
  - Define responsive positioning types and configuration schema
  - Export types for use across components
  - _Requirements: 1.1, 3.1, 7.1_

- [ ] 2. Implement core TOC components
  - Build the main TableOfContents component with basic rendering
  - Create TOCContent component for list rendering
  - Implement TOCItem component with proper styling
  - Add TOCToggle component for mobile interactions
  - _Requirements: 1.1, 1.3, 2.1, 2.4_

- [ ] 2.1 Create main TableOfContents component
  - Implement component with props interface and basic structure
  - Add conditional rendering based on heading count (minimum 3 headings)
  - Include responsive positioning logic placeholder
  - Add proper TypeScript typing and prop validation
  - _Requirements: 1.1, 1.2_

- [ ] 2.2 Build TOCContent list component
  - Create component that renders hierarchical heading list
  - Implement proper indentation for different heading levels (H2-H6)
  - Add click handlers for navigation
  - Include accessibility attributes (ARIA labels, roles)
  - _Requirements: 1.3, 6.2_

- [ ] 2.3 Implement TOCItem individual item component
  - Create reusable component for individual TOC entries
  - Add hover effects and active state styling
  - Implement proper semantic HTML structure
  - Include keyboard navigation support
  - _Requirements: 2.4, 6.1, 8.4_

- [ ] 2.4 Create TOCToggle mobile component
  - Build toggle button for mobile TOC collapse/expand
  - Add proper ARIA attributes for accessibility
  - Include item count display in toggle text
  - Implement smooth animation states
  - _Requirements: 3.3, 6.2, 8.3_

- [ ] 3. Add responsive behavior and positioning
  - Implement responsive hooks for breakpoint detection
  - Add positioning logic for different screen sizes
  - Create sticky positioning for desktop sidebar
  - Implement mobile collapsible behavior
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3.1 Create useResponsive hook
  - Implement hook to detect current breakpoint (mobile/tablet/desktop)
  - Add logic to determine appropriate TOC positioning based on screen size
  - Include window resize event handling with cleanup
  - Return responsive state and positioning recommendations
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 3.2 Implement positioning logic
  - Add conditional rendering for sidebar, top, and floating positions
  - Create CSS classes for different positioning modes
  - Implement sticky behavior for desktop sidebar with proper boundaries
  - Add responsive breakpoint-based position switching
  - _Requirements: 3.1, 3.2, 3.4, 4.4_

- [ ] 3.3 Add mobile collapsible functionality
  - Implement state management for mobile TOC visibility
  - Add smooth height transitions for expand/collapse
  - Include proper focus management when toggling
  - Add touch-friendly interaction areas
  - _Requirements: 3.3, 8.3, 6.1_

- [ ] 4. Create scroll spy functionality
  - Implement useScrollSpy hook with Intersection Observer
  - Add active section tracking and highlighting
  - Create smooth scroll navigation between sections
  - Handle edge cases and performance optimization
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 4.1 Build useScrollSpy hook
  - Implement Intersection Observer-based scroll tracking
  - Add logic to determine currently visible heading
  - Handle multiple visible headings (select topmost)
  - Include proper cleanup and performance optimization
  - _Requirements: 5.1, 5.2, 6.3_

- [ ] 4.2 Implement active section highlighting
  - Add visual feedback for currently active TOC item
  - Create smooth transitions between active states
  - Implement auto-scroll for TOC when active item changes
  - Add proper color and styling changes for active state
  - _Requirements: 5.3, 5.4, 5.5, 8.2_

- [ ] 4.3 Add smooth scroll navigation
  - Implement smooth scrolling when clicking TOC links
  - Add proper offset calculation for sticky headers
  - Include animation duration and easing configuration
  - Handle browser compatibility and fallbacks
  - _Requirements: 1.5, 8.1_

- [ ] 5. Integrate with existing layouts
  - Modify PostLayout to include TOC in sidebar
  - Update PostSimple to show TOC at content top
  - Integrate TOC with PostBanner after banner image
  - Ensure proper spacing and visual hierarchy
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ] 5.1 Update PostLayout component
  - Add TOC component to left sidebar area on desktop
  - Position TOC above author information section
  - Maintain existing grid structure and responsive behavior
  - Ensure proper spacing and visual integration
  - _Requirements: 4.1, 4.5_

- [ ] 5.2 Modify PostSimple layout
  - Integrate TOC at the top of content area
  - Maintain clean, simple layout aesthetic
  - Add proper spacing between TOC and content
  - Ensure responsive behavior across all screen sizes
  - _Requirements: 4.2, 4.5_

- [ ] 5.3 Update PostBanner layout
  - Position TOC after banner image but before content
  - Integrate with existing content flow and spacing
  - Maintain visual hierarchy and banner prominence
  - Add proper responsive behavior for banner + TOC combination
  - _Requirements: 4.3, 4.5_

- [ ] 6. Add configuration and customization options
  - Create TOC configuration schema in siteMetadata
  - Implement per-post frontmatter overrides
  - Add configuration parsing and validation
  - Create useTOCConfig hook for settings management
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 6.1 Define configuration schema
  - Add TOC settings to siteMetadata.js structure
  - Define default configuration values (enabled: true, minHeadings: 3, maxDepth: 6)
  - Create TypeScript interfaces for configuration options
  - Document configuration options and their effects
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 6.2 Implement per-post overrides
  - Add TOC frontmatter options to blog post schema
  - Support boolean and object-based TOC configuration in frontmatter
  - Implement configuration merging logic (frontmatter overrides global)
  - Add validation for frontmatter TOC settings
  - _Requirements: 7.4, 7.5_

- [ ] 6.3 Create useTOCConfig hook
  - Build hook to parse and merge TOC configuration
  - Include global settings and per-post overrides
  - Add configuration validation and error handling
  - Return processed configuration object for components
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7. Style components with modern design
  - Create Tailwind CSS classes for TOC styling
  - Implement dark mode support
  - Add hover effects and transitions
  - Create responsive typography and spacing
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 7.1 Design TOC container and layout styles
  - Create modern card-based design with subtle shadows and rounded corners
  - Implement proper spacing, padding, and border styles
  - Add background colors and border styles for light and dark themes
  - Create responsive layout styles for different positions
  - _Requirements: 2.1, 2.5_

- [ ] 7.2 Implement typography and hierarchy styles
  - Create different font sizes and weights for heading levels (H2-H6)
  - Add proper indentation for nested headings
  - Implement consistent line height and spacing
  - Add responsive typography scaling
  - _Requirements: 2.3_

- [ ] 7.3 Add interactive states and animations
  - Create hover effects for TOC items with color transitions
  - Implement active state styling with visual feedback
  - Add smooth transitions for state changes
  - Include focus indicators for keyboard navigation
  - _Requirements: 2.4, 8.2, 8.4_

- [ ] 7.4 Create dark mode support
  - Define dark theme color variables and classes
  - Implement automatic theme switching with existing theme system
  - Test color contrast and accessibility in both themes
  - Add proper dark mode variants for all interactive states
  - _Requirements: 2.2, 2.5_

- [ ] 8. Implement accessibility features
  - Add proper ARIA labels and roles
  - Ensure keyboard navigation support
  - Test with screen readers
  - Add focus management and indicators
  - _Requirements: 6.1, 6.2_

- [ ] 8.1 Add ARIA labels and semantic structure
  - Include proper ARIA labels for TOC navigation
  - Add semantic HTML structure with nav, ul, li elements
  - Implement proper heading hierarchy and relationships
  - Add screen reader friendly text and descriptions
  - _Requirements: 6.2_

- [ ] 8.2 Implement keyboard navigation
  - Ensure all TOC links are focusable and keyboard accessible
  - Add proper tab order and focus management
  - Implement Enter and Space key handling for interactions
  - Add visible focus indicators with proper contrast
  - _Requirements: 6.1_

- [ ]* 8.3 Test with accessibility tools
  - Run automated accessibility tests with axe-core or similar
  - Test with screen readers (NVDA, JAWS, VoiceOver)
  - Verify keyboard-only navigation functionality
  - Check color contrast ratios for WCAG compliance
  - _Requirements: 6.1, 6.2_

- [ ] 9. Add performance optimizations
  - Implement lazy loading for TOC component
  - Optimize scroll event handling
  - Add React.memo for pure components
  - Minimize bundle size impact
  - _Requirements: 6.3, 6.4_

- [ ] 9.1 Implement component lazy loading
  - Use React.lazy for TOC component code splitting
  - Add loading states and fallbacks
  - Defer scroll spy initialization until component is visible
  - Optimize initial page load performance
  - _Requirements: 6.3_

- [ ] 9.2 Optimize scroll event handling
  - Implement throttling for scroll events and Intersection Observer
  - Use passive event listeners where appropriate
  - Add proper cleanup on component unmount
  - Minimize re-renders with React.memo and useMemo
  - _Requirements: 6.4_

- [ ] 10. Add smooth animations and transitions
  - Implement smooth scroll animations
  - Add transition effects for active state changes
  - Create mobile toggle animations
  - Respect user's reduced motion preferences
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [ ] 10.1 Create smooth scroll animations
  - Implement smooth scrolling with proper easing and duration
  - Add offset calculation for sticky headers and proper positioning
  - Include fallbacks for browsers without smooth scroll support
  - Add configuration options for animation speed and behavior
  - _Requirements: 8.1_

- [ ] 10.2 Add state transition animations
  - Create smooth transitions for active state highlighting
  - Implement hover effect animations with appropriate timing
  - Add mobile toggle expand/collapse animations
  - Include loading and state change animations
  - _Requirements: 8.2, 8.3, 8.4_

- [ ] 10.3 Implement reduced motion support
  - Detect and respect prefers-reduced-motion user setting
  - Provide instant transitions when reduced motion is preferred
  - Maintain functionality while reducing or eliminating animations
  - Test with reduced motion settings enabled
  - _Requirements: 8.5_

- [ ] 11. Create comprehensive tests
  - Write unit tests for components and hooks
  - Add integration tests for layout integration
  - Test responsive behavior across breakpoints
  - Verify accessibility compliance
  - _Requirements: All requirements validation_

- [ ]* 11.1 Write component unit tests
  - Test TOC component rendering with different props and configurations
  - Test hook functionality (useScrollSpy, useResponsive, useTOCConfig)
  - Test user interactions (clicks, keyboard navigation, toggle)
  - Test edge cases (no headings, invalid data, missing configuration)
  - _Requirements: All requirements validation_

- [ ]* 11.2 Add integration tests
  - Test TOC integration with different layout components
  - Test responsive behavior and breakpoint transitions
  - Test configuration parsing and override functionality
  - Test scroll spy accuracy and active state management
  - _Requirements: All requirements validation_

- [ ]* 11.3 Test accessibility compliance
  - Run automated accessibility tests
  - Test keyboard navigation and focus management
  - Verify screen reader compatibility and ARIA implementation
  - Test color contrast and visual accessibility
  - _Requirements: 6.1, 6.2_

- [ ] 12. Update documentation and examples
  - Update README with TOC feature documentation
  - Create configuration examples
  - Add usage examples for different layouts
  - Document customization options
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12.1 Create feature documentation
  - Document TOC feature capabilities and configuration options
  - Add examples of different TOC positions and responsive behavior
  - Include troubleshooting guide and common issues
  - Document accessibility features and best practices
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12.2 Add configuration examples
  - Provide example siteMetadata.js configurations
  - Show frontmatter override examples
  - Include styling customization examples
  - Document advanced configuration scenarios
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_