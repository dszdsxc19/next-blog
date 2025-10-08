interface ArchiveBadgeProps {
  className?: string
  size?: 'default' | 'compact'
}

export default function ArchiveBadge({ className, size = 'default' }: ArchiveBadgeProps) {
  const baseClasses =
    'inline-flex items-center rounded border border-amber-400 font-semibold uppercase tracking-wide text-amber-600 dark:border-amber-500 dark:text-amber-300'
  const sizeClasses =
    size === 'compact' ? 'px-1.5 py-0 text-[10px] leading-[14px]' : 'px-2 py-0.5 text-xs leading-4'
  const classes = `${baseClasses} ${sizeClasses}${className ? ` ${className}` : ''}`
  return <span className={classes}>归档</span>
}
