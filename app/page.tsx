import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { filterRegularPosts } from '@/lib/blog'
import Main from './Main'

export default async function Page() {
  // @ts-ignore
  const sortedPosts = sortPosts(filterRegularPosts(allBlogs))
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
