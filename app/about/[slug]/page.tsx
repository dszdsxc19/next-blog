import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { allAuthors } from 'contentlayer/generated'
import AuthorLayout from '@/layouts/AuthorLayout'
import { resolveAuthor } from '@/lib/authors'
import { genPageMetadata } from 'app/seo'

export const generateStaticParams = async () => {
  return allAuthors.map((author) => ({ slug: author.slug }))
}

export const dynamicParams = false

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const decodedSlug = decodeURI(slug)
  const resolved = resolveAuthor(decodedSlug)

  if (!resolved) {
    return
  }

  const { mainContent } = resolved

  return genPageMetadata({
    title: mainContent.name,
    description: mainContent.occupation,
  })
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const decodedSlug = decodeURI(slug)
  const resolved = resolveAuthor(decodedSlug)

  if (!resolved) {
    notFound()
  }

  const { author, mainContent } = resolved

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}
