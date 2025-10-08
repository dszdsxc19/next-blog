import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { resolveAuthor } from '@/lib/authors'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const resolved = resolveAuthor('default')

  if (!resolved) {
    notFound()
  }

  const { author, mainContent } = resolved

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
