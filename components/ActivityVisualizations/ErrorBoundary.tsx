'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>
    onError?: (error: Error, errorInfo: ErrorInfo) => void
    isolate?: boolean // Whether to isolate this error boundary
}

export class VisualizationErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        }
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo
        })

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Visualization Error Boundary caught an error:', error, errorInfo)
        }

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }

        // In production, you might want to send this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error, { extra: errorInfo })
        }
    }

    retry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        })
    }

    render() {
        if (this.state.hasError && this.state.error) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback
            return <FallbackComponent error={this.state.error} retry={this.retry} />
        }

        return this.props.children
    }
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Visualization Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        Something went wrong while loading the visualization.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-xs text-red-600 dark:text-red-400">
                                Error Details (Development)
                            </summary>
                            <pre className="mt-2 whitespace-pre-wrap text-xs text-red-600 dark:text-red-400">
                                {error.message}
                                {error.stack}
                            </pre>
                        </details>
                    )}
                    <div className="mt-4">
                        <button
                            onClick={retry}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Specific error fallback for heatmap
 */
export function HeatmapErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
    return (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20">
            <div className="text-center">
                <div className="mx-auto h-12 w-12 text-orange-600 dark:text-orange-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-orange-800 dark:text-orange-200">
                    Activity Heatmap Unavailable
                </h3>
                <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                    The activity heatmap couldn't be loaded. This might be due to missing data or a library issue.
                </p>
                <div className="mt-4 space-x-2">
                    <button
                        onClick={retry}
                        className="rounded bg-orange-600 px-3 py-1 text-sm text-white hover:bg-orange-700"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded border border-orange-600 px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
    )
}

/**
 * Specific error fallback for treemap
 */
export function TreemapErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
    return (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
            <div className="text-center">
                <div className="mx-auto h-12 w-12 text-purple-600 dark:text-purple-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-purple-800 dark:text-purple-200">
                    Tag Treemap Unavailable
                </h3>
                <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                    The tag treemap couldn't be loaded. This might be due to missing tag data or a rendering issue.
                </p>
                <div className="mt-4 space-x-2">
                    <button
                        onClick={retry}
                        className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded border border-purple-600 px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
    )
}

/**
 * Graceful degradation component for when JavaScript is disabled
 */
export function NoScriptFallback({ activityData, tagData }: { activityData: any[], tagData: any[] }) {
    return (
        <noscript>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Activity Summary (JavaScript Disabled)
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                            Recent Activity
                        </h4>
                        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {activityData?.slice(-10).map((day: any, index: number) => (
                                <div key={index}>
                                    {day.date}: {day.count} {day.count === 1 ? 'post' : 'posts'}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                            Popular Topics
                        </h4>
                        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {tagData?.slice(0, 10).map((tag: any, index: number) => (
                                <div key={index}>
                                    {tag.name}: {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
                    Enable JavaScript to see interactive visualizations.
                </p>
            </div>
        </noscript>
    )
}

/**
 * Network error fallback
 */
export function NetworkErrorFallback({ retry }: { retry: () => void }) {
    return (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Connection Issue
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        Unable to load visualization data. Please check your internet connection.
                    </p>
                    <div className="mt-4">
                        <button
                            onClick={retry}
                            className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Hook for handling async errors in functional components
 */
export function useErrorHandler() {
    const [error, setError] = React.useState<Error | null>(null)

    const resetError = () => setError(null)

    const handleError = React.useCallback((error: Error) => {
        setError(error)
    }, [])

    React.useEffect(() => {
        if (error) {
            console.error('Async error caught:', error)
        }
    }, [error])

    return { error, handleError, resetError }
}

export default VisualizationErrorBoundary