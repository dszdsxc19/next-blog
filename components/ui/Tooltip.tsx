import React, { useState, useRef, useEffect } from 'react'

interface TooltipProps {
    content: React.ReactNode
    children: React.ReactNode
    position?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
}

export function Tooltip({
    content,
    children,
    position = 'top',
    className = ''
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const triggerRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()

        let x = 0
        let y = 0

        switch (position) {
            case 'top':
                x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
                y = triggerRect.top - tooltipRect.height - 8
                break
            case 'bottom':
                x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
                y = triggerRect.bottom + 8
                break
            case 'left':
                x = triggerRect.left - tooltipRect.width - 8
                y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
                break
            case 'right':
                x = triggerRect.right + 8
                y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
                break
        }

        setTooltipPosition({ x, y })
    }

    useEffect(() => {
        if (isVisible) {
            updatePosition()
        }
    }, [isVisible, position])

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="inline-block"
            >
                {children}
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`fixed z-50 rounded bg-gray-900 px-2 py-1 text-sm text-white shadow-lg dark:bg-gray-100 dark:text-gray-900 ${className}`}
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                    }}
                >
                    {content}
                </div>
            )}
        </>
    )
}

export default Tooltip