import React from 'react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    text?: string
}

export function LoadingSpinner({
    size = 'md',
    className = '',
    text
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="flex flex-col items-center space-y-2">
                <div
                    className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400 ${sizeClasses[size]}`}
                />
                {text && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
                )}
            </div>
        </div>
    )
}

export default LoadingSpinner