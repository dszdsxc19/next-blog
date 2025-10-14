'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface VisualizationThemeContext {
    isDark: boolean
    theme: string | undefined
    resolvedTheme: string | undefined
    toggleTheme: () => void
    getVisualizationColors: (type: 'heatmap' | 'treemap') => string[]
}

const VisualizationThemeContext = createContext<VisualizationThemeContext | undefined>(undefined)

interface VisualizationThemeProviderProps {
    children: React.ReactNode
}

export function VisualizationThemeProvider({ children }: VisualizationThemeProviderProps) {
    const { theme, resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : false

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark')
    }

    const getVisualizationColors = (type: 'heatmap' | 'treemap'): string[] => {
        if (type === 'heatmap') {
            return isDark
                ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
                : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
        } else {
            return isDark
                ? [
                    '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d',
                    '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7',
                    '#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3'
                ]
                : [
                    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
                    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
                    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'
                ]
        }
    }

    const contextValue: VisualizationThemeContext = {
        isDark,
        theme,
        resolvedTheme,
        toggleTheme,
        getVisualizationColors
    }

    return (
        <VisualizationThemeContext.Provider value={contextValue}>
            {children}
        </VisualizationThemeContext.Provider>
    )
}

export function useVisualizationTheme() {
    const context = useContext(VisualizationThemeContext)
    if (context === undefined) {
        throw new Error('useVisualizationTheme must be used within a VisualizationThemeProvider')
    }
    return context
}

/**
 * CSS custom properties for smooth theme transitions
 */
export const visualizationThemeStyles = `
  .visualization-container {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }
  
  .visualization-heatmap {
    transition: all 0.3s ease;
  }
  
  .visualization-treemap {
    transition: all 0.3s ease;
  }
  
  .visualization-tooltip {
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  .visualization-loading {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
  
  /* Dark mode specific styles */
  .dark .visualization-container {
    background-color: rgb(31 41 55);
    border-color: rgb(75 85 99);
    color: rgb(249 250 251);
  }
  
  .dark .visualization-tooltip {
    background-color: rgba(17, 24, 39, 0.9);
    border-color: rgb(75 85 99);
    color: rgb(249 250 251);
  }
  
  /* Light mode specific styles */
  .light .visualization-container {
    background-color: rgb(255 255 255);
    border-color: rgb(229 231 235);
    color: rgb(17 24 39);
  }
  
  .light .visualization-tooltip {
    background-color: rgba(255, 255, 255, 0.9);
    border-color: rgb(229 231 235);
    color: rgb(17 24 39);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .visualization-container {
      padding: 1rem;
    }
    
    .visualization-heatmap {
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: rgb(156 163 175) transparent;
    }
    
    .visualization-heatmap::-webkit-scrollbar {
      height: 6px;
    }
    
    .visualization-heatmap::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .visualization-heatmap::-webkit-scrollbar-thumb {
      background-color: rgb(156 163 175);
      border-radius: 3px;
    }
    
    .dark .visualization-heatmap::-webkit-scrollbar-thumb {
      background-color: rgb(75 85 99);
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .visualization-container {
      border-width: 2px;
    }
    
    .visualization-tooltip {
      border-width: 2px;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .visualization-container,
    .visualization-heatmap,
    .visualization-treemap,
    .visualization-tooltip {
      transition: none;
    }
    
    .visualization-loading {
      animation: none;
    }
  }
`

/**
 * Component to inject theme styles
 */
export function VisualizationThemeStyles() {
    return (
        <style jsx global>{visualizationThemeStyles}</style>
    )
}