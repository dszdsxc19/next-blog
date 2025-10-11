'use client'

import React, { Suspense, lazy } from 'react'
import { TableOfContentsProps } from '@/types/toc'

// Lazy load the main TableOfContents component
const TableOfContentsComponent = lazy(() => import('./TableOfContents'))

// Loading fallback component
const TOCLoadingFallback: React.FC = () => (
  <div className="table-of-contents animate-pulse">
    <div className="px-4 pt-4 pb-2">
      <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div className="space-y-2 px-4 pb-4">
      <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="ml-3 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="ml-6 h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="ml-3 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  </div>
)

// Error boundary fallback
const TOCErrorFallback: React.FC = () => (
  <div className="table-of-contents">
    <div className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
      Table of contents unavailable
    </div>
  </div>
)

interface LazyTableOfContentsProps extends TableOfContentsProps {
  fallback?: React.ComponentType
  errorFallback?: React.ComponentType
}

const LazyTableOfContents: React.FC<LazyTableOfContentsProps> = ({
  fallback: CustomFallback = TOCLoadingFallback,
  errorFallback: CustomErrorFallback = TOCErrorFallback,
  ...props
}) => {
  return (
    <Suspense fallback={<CustomFallback />}>
      <ErrorBoundary fallback={CustomErrorFallback}>
        <TableOfContentsComponent {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ComponentType }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('TOC Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback
      return <Fallback />
    }

    return this.props.children
  }
}

export default LazyTableOfContents
