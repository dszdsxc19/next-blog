'use client'

import { ReactNode, useEffect, useState } from 'react'
import ArchiveBadge from '@/components/ArchiveBadge'
import Image from '@/components/Image'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { SkeletonTOC } from '@/components/TableOfContents'
import { extractTOCFromDOM, shouldShowTOC } from '@/lib/utils/extractTOC'
import { useTOCConfig } from '@/lib/hooks/useTOCConfig'
import { TOCItem } from '@/types/toc'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostMinimal({ content, next, prev, children }: LayoutProps) {
  const { slug, title, images, isArchive, toc: postTOCConfig } = content
  const displayImage =
    images && images.length > 0 ? images[0] : 'https://picsum.photos/seed/picsum/800/400'
  const [toc, setToc] = useState<TOCItem[]>([])

  // Get TOC configuration
  const { config: tocConfig, shouldShowTOC: tocEnabled } = useTOCConfig(postTOCConfig)

  // Extract TOC from DOM after component mounts
  useEffect(() => {
    const extractedTOC = extractTOCFromDOM()
    setToc(extractedTOC)
  }, [children])

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="space-y-1 pb-10 text-center dark:border-gray-700">
            <div className="w-full">
              <Bleed>
                <div className="relative aspect-2/1 w-full">
                  <Image src={displayImage} alt={title} fill className="object-cover" />
                </div>
              </Bleed>
            </div>
            <div className="relative pt-10">
              <PageTitle>{title}</PageTitle>
              {isArchive ? (
                <div className="mt-3 flex justify-center">
                  <ArchiveBadge />
                </div>
              ) : null}
            </div>
          </div>



          <div className="prose dark:prose-invert max-w-none py-4 relative">
            {/* Skeleton TOC - positioned in article top-right */}
            {tocEnabled && shouldShowTOC(toc, tocConfig.minHeadings) && (
              <SkeletonTOC toc={toc} minHeadings={tocConfig.minHeadings} maxDepth={tocConfig.maxDepth} />
            )}
            {children}
          </div>
          {siteMetadata.comments && (
            <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <Comments slug={slug} />
            </div>
          )}
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}
