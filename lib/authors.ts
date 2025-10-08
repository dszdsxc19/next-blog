import { coreContent } from 'pliny/utils/contentlayer'
import { allAuthors, Authors } from 'contentlayer/generated'

export function resolveAuthor(slug: string) {
  const match = allAuthors.find((author) => author.slug === slug) as Authors | undefined

  if (!match) {
    return undefined
  }

  return {
    author: match,
    mainContent: coreContent(match),
  }
}
