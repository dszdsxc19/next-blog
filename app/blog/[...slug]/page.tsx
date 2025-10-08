import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import type { CoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { filterRegularPosts, getSiblingPosts, isCategoryIndexPost } from '@/lib/blog'
import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/Link'
import Tag from '@/components/Tag'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

function CategoryPostList({ posts }: { posts: CoreContent<Blog>[] }) {
  if (!posts.length) {
    return null
  }

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
        More in this section
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((item) => (
          <li key={item.path} className="py-6">
            <article className="space-y-3">
              <dl>
                <dt className="sr-only">Published on</dt>
                <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                  <time dateTime={item.date}>{formatDate(item.date, siteMetadata.locale)}</time>
                </dd>
              </dl>
              <div className="space-y-2">
                <h3 className="text-2xl leading-8 font-semibold tracking-tight">
                  <Link href={`/${item.path}`} className="text-gray-900 dark:text-gray-100">
                    {item.title}
                  </Link>
                </h3>
                {item.tags?.length ? (
                  <div className="flex flex-wrap">
                    {item.tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                ) : null}
                <p className="prose max-w-none text-gray-500 dark:text-gray-400">{item.summary}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img && img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const visibleCoreContents = filterRegularPosts(sortedCoreContents)
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const navIndex = visibleCoreContents.findIndex((p) => p.slug === slug)
  const prev = navIndex === -1 ? undefined : visibleCoreContents[navIndex + 1]
  const next = navIndex === -1 ? undefined : visibleCoreContents[navIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = layouts[post.layout || defaultLayout]
  const isCategoryIndex = isCategoryIndexPost(post)
  const categoryDirectory = isCategoryIndex ? post.path.replace(/\/index$/, '') : ''
  const categoryPosts =
    isCategoryIndex && categoryDirectory
      ? allCoreContent(sortPosts(getSiblingPosts(filterRegularPosts(allBlogs), categoryDirectory)))
      : []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <>
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
          {isCategoryIndex && <CategoryPostList posts={categoryPosts} />}
        </>
      </Layout>
    </>
  )
}
