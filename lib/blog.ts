import type { Blog } from 'contentlayer/generated'

type PostLike = Pick<Blog, 'category' | 'filePath' | 'path' | 'draft'> & {
  category?: boolean
  filePath?: string
  path?: string
  draft?: boolean
}

export function filterPublishedPosts<T extends PostLike>(posts: T[]): T[] {
  return posts.filter((post) => post?.draft !== true)
}

export function isCategoryIndexPost(post: PostLike | null | undefined): boolean {
  if (!post || post.category !== true) {
    return false
  }
  const sourcePath = post.filePath ?? ''
  return /(^|\/)index\.mdx$/.test(sourcePath)
}

export function filterRegularPosts<T extends PostLike>(posts: T[]): T[] {
  return filterPublishedPosts(posts).filter((post) => !isCategoryIndexPost(post))
}

export function filterRegularBlogPosts(posts: Blog[]): Blog[] {
  return filterPublishedPosts(posts).filter((post) => !isCategoryIndexPost(post))
}

export function getSiblingPosts<T extends PostLike>(posts: T[], directoryPath: string): T[] {
  const normalizedDirectory = directoryPath.replace(/\/$/, '')
  const prefix = `${normalizedDirectory}/`
  return posts.filter((post) => {
    if (post?.draft === true) {
      return false
    }
    if (!post.path) {
      return false
    }
    if (!post.path.startsWith(prefix)) {
      return false
    }
    if (post.path === normalizedDirectory) {
      return false
    }
    return !isCategoryIndexPost(post)
  })
}
