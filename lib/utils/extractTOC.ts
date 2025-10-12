import { TOCItem } from '@/types/toc'

/**
 * Extract table of contents from HTML content
 */
export const extractTOCFromHTML = (htmlContent: string): TOCItem[] => {
  if (typeof window === 'undefined') {
    // Server-side: use a simple regex approach
    return extractTOCFromHTMLServer(htmlContent)
  }

  // Client-side: use DOM parsing
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

  const toc: TOCItem[] = []

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))
    const text = heading.textContent || ''
    const id = heading.id || generateSlug(text)

    // Ensure heading has an ID
    if (!heading.id) {
      heading.id = id
    }

    toc.push({
      value: text,
      url: `#${id}`,
      depth: level,
    })
  })

  return toc
}

/**
 * Server-side TOC extraction using regex
 */
const extractTOCFromHTMLServer = (htmlContent: string): TOCItem[] => {
  const headingRegex = /<h([1-6])(?:\s+id="([^"]*)")?[^>]*>(.*?)<\/h[1-6]>/gi
  const toc: TOCItem[] = []
  let match

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1])
    const existingId = match[2]
    const text = match[3].replace(/<[^>]*>/g, '') // Strip HTML tags
    const id = existingId || generateSlug(text)

    toc.push({
      value: text,
      url: `#${id}`,
      depth: level,
    })
  }

  return toc
}

/**
 * Extract TOC from DOM (client-side only)
 */
export const extractTOCFromDOM = (): TOCItem[] => {
  if (typeof window === 'undefined') return []

  const scopeSelector = '[data-toc-scope="article"]'
  const scopedRoot = document.querySelector(scopeSelector)
  const root: ParentNode = scopedRoot ?? document
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const toc: TOCItem[] = []

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))
    const text = heading.textContent || ''
    let id = heading.id

    // Generate ID if it doesn't exist
    if (!id) {
      id = generateSlug(text)
      heading.id = id
    }

    toc.push({
      value: text,
      url: `#${id}`,
      depth: level,
    })
  })

  return toc
}

/**
 * Generate URL-safe slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Check if content has enough headings for TOC
 */
export const shouldShowTOC = (toc: TOCItem[], minHeadings: number = 3): boolean => {
  return toc.length >= minHeadings
}
