import type { StaticImport } from 'next/dist/shared/lib/get-img-props'

declare module '*.svg' {
  const StaticImage: StaticImport
  export default StaticImage
}
