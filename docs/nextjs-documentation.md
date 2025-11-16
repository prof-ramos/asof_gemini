### Next.js App Router Dynamic MDX Imports with generateStaticParams

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

This snippet demonstrates how to dynamically import MDX components in a Next.js App Router environment using route segments and `generateStaticParams`. It shows fetching specific MDX files based on a `slug` parameter, optimizing content for static pre-rendering while allowing for dynamic content variations.

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}

export const dynamicParams = false
```

```jsx
export default async function Page({ params }) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}

export const dynamicParams = false
```

--------------------------------

### Next.js App Router MDX Project Structure

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

This text snippet illustrates the recommended directory layout for integrating MDX files within a Next.js application when using the App Router. It details the placement of MDX content, corresponding route files, and the `mdx-components` configuration for a structured project setup.

```txt
  .
  ├── app/
  │   └── mdx-page/
  │       └── page.(tsx/js)
  ├── markdown/
  │   └── welcome.(mdx/md)
  ├── mdx-components.(tsx/js)
  └── package.json
```

--------------------------------

### Generate Static Parameters for Next.js `app` Directory with `generateStaticParams`

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This example illustrates how to use `generateStaticParams` in the Next.js `app` directory, which replaces `getStaticPaths` for defining static route parameters. It features a simplified API for returning an array of segment objects and shows an asynchronous function for fetching post data and rendering with `PostLayout`.

```jsx
// `app` directory
import PostLayout from '@/components/post-layout'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${(await params).id}`)
  const post = await res.json()

  return post
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return <PostLayout post={post} />
}
```

--------------------------------

### Import MDX into Next.js App Router Page Component

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

This snippet illustrates how to import and render an MDX file, such as `welcome.mdx`, directly within a Next.js App Router `page.tsx` or `page.js` component. The imported MDX content is treated as a React component, enabling seamless integration of markdown-driven content into your application's routes.

```tsx
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

```jsx
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

--------------------------------

### Implement Shared Layouts for MDX Pages using Next.js Pages Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

These examples show how to create and integrate a reusable layout component for MDX pages in the Next.js Pages Router. You first define a layout component and then import it directly into your MDX file, wrapping the MDX content to apply the shared structure and styles.

```tsx
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

```jsx
export default function MdxLayout({ children }) {
  // Create any shared layout or styles here
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

```mdx
import MdxLayout from '../components/mdx-layout'

# Welcome to my MDX page!

export default function MDXPage({ children }) {
  return <MdxLayout>{children}</MdxLayout>

}
```

--------------------------------

### Configure Next.js `dynamic` Behavior for App Router Layouts, Pages, and Routes

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/route-segment-config.mdx

The `dynamic` export configures the rendering and caching strategy for Next.js App Router layouts, pages, or route handlers. It accepts values like `'auto'`, `'force-dynamic'`, `'error'`, or `'force-static'` to control server-side rendering, data fetching, and caching behavior. This allows developers to fine-tune how routes interact with dynamic APIs and data, offering a migration path from the `pages` directory's `getServerSideProps` and `getStaticProps` models.

```tsx
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

```js
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

--------------------------------

### Implement Root Layout Component (App Directory)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This JSX snippet shows a Server Component `layout.js` in the `app` directory, which imports and uses the `DashboardLayout` Client Component. This `layout.js` file now serves as the nested layout for the `/app/dashboard` route, replacing the `getLayout` pattern from the `pages` directory.

```jsx
import DashboardLayout from './DashboardLayout'

// This is a Server Component
export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
```

--------------------------------

### Implement getStaticPaths, getStaticProps, and Page Component for Dynamic Routes in Next.js

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-paths.mdx

This snippet demonstrates how to use `getStaticPaths` to define paths for static pre-rendering, `getStaticProps` to fetch data for those paths at build time, and a React component to render the page in Next.js. It's suitable for dynamic routes requiring static generation, fetching data from an external API like GitHub.

```tsx
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      },
    ],
    fallback: true,
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count
}
```

```jsx
export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      },
    ],
    fallback: true,
  }
}

export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}

export default function Page({ repo }) {
  return repo.stargazers_count
}
```

--------------------------------

### Implement Custom Image Loader for Next.js Image Component (JavaScript)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/02-components/image.mdx

This code demonstrates defining a custom `loader` function for the Next.js `Image` component. The `loader` function receives `src`, `width`, and `quality` parameters and returns a dynamically generated URL for the image. This mechanism is crucial for integrating with external image optimization services or custom asset paths, supporting both App and Pages Router environments.

```js
'use client'\n\nimport Image from 'next/image'\n\nconst imageLoader = ({ src, width, quality }) => {\n  return `https://example.com/${src}?w=${width}&q=${quality || 75}`\n}\n\nexport default function Page() {\n  return (\n    <Image\n      loader={imageLoader}\n      src="me.png"\n      alt="Picture of the author"\n      width={500}\n      height={500}\n    />\n  )\n}
```

```js
import Image from 'next/image'\n\nconst imageLoader = ({ src, width, quality }) => {\n  return `https://example.com/${src}?w=${width}&q=${quality || 75}`\n}\n\nexport default function Page() {\n  return (\n    <Image\n      loader={imageLoader}\n      src="me.png"\n      alt="Picture of the author"\n      width={500}\n      height={500}\n    />\n  )\n}
```

--------------------------------

### Import MDX Metadata in Next.js App Router Components

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

This example demonstrates how to import and access metadata defined within an MDX file from a Next.js App Router `page.tsx` or `page.js` component. It shows the `metadata` export alongside the default component export, enabling server-side access to frontmatter data.

```tsx
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata: ', metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

```jsx
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata: ', metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

--------------------------------

### Change Next.js Image Optimization API Path

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/02-components/image.mdx

Modify the default path for the Next.js Image Optimization API by setting the `path` property within the `images` configuration in `next.config.js`. This allows you to prefix or completely change the endpoint, which is `/_next/image` by default, to suit your deployment or routing needs.

```js
module.exports = {
  images: {
    path: '/my-prefix/_next/image',
  },
}
```

--------------------------------

### Generate Dynamic Open Graph Image with External Data in Next.js

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.mdx

This snippet demonstrates how to create a dynamic Open Graph image for a Next.js route, fetching post data from an external API using the `slug` parameter. It leverages `ImageResponse` to render a JSX element as an image, displaying the post's title. By default, the generated image is statically optimized, but its caching behavior can be configured using `fetch` options or route segment revalidation.

```tsx
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetch(`https://.../posts/${slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

```jsx
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { slug } = await params
  const post = await fetch(`https://.../posts/${slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

--------------------------------

### Integrate Web Vitals in App Router Layout

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/use-report-web-vitals.mdx

Shows how to integrate the Web Vitals component into the root layout of an App Router application.

```jsx
import { WebVitals } from './_components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

--------------------------------

### Configure Next.js pageExtensions with MDX for App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/pageExtensions.mdx

This configuration shows how to extend the default page extensions in Next.js to include Markdown (.md) and MDX (.mdx) files when using the App Router. It integrates `@next/mdx` to process these file types, allowing Next.js to recognize them as valid pages. This enables building content-driven pages using markdown.

```js
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

module.exports = withMDX(nextConfig)
```

--------------------------------

### Render Remote MDX Content in Next.js App Router with next-mdx-remote-client

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

This snippet demonstrates how to fetch and render remote MDX content dynamically within a Next.js App Router component. It uses `MDXRemote` from `next-mdx-remote-client/rsc` to process MDX text fetched from an external source, such as a database or CMS. The component is an `async` function, allowing direct `await` calls for data fetching.

```tsx
import { MDXRemote } from 'next-mdx-remote-client/rsc'

export default async function RemoteMdxPage() {
  // MDX text - can be from a database, CMS, fetch, anywhere...
  const res = await fetch('https://...')
  const markdown = await res.text()
  return <MDXRemote source={markdown} />
}
```

```jsx
import { MDXRemote } from 'next-mdx-remote-client/rsc'

export default async function RemoteMdxPage() {
  // MDX text - can be from a database, CMS, fetch, anywhere...
  const res = await fetch('https://...')
  const markdown = await res.text()
  return <MDXRemote source={markdown} />
}
```

--------------------------------

### Implement Static Site Generation (SSG) in Next.js pages with getStaticProps

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx

This code demonstrates using `getStaticProps` in the `pages` directory to fetch data at build time. The fetched `projects` data is then passed as props to the `Index` page component, enabling static pre-rendering.

```jsx
// `pages` directory

export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```

--------------------------------

### Include Google Analytics in Next.js App Router Root Layout

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx

This code demonstrates how to integrate Google Analytics 4 into a Next.js application using the App Router by placing the `GoogleAnalytics` component in the `app/layout.tsx` or `app/layout.js` file. This ensures GA4 is loaded for all routes, requiring a valid Google Analytics Measurement ID (`gaId`).

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

```jsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

--------------------------------

### Next.js Pages Router MDX Project Structure

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

This text snippet illustrates the recommended directory layout for integrating MDX files within a Next.js application when using the Pages Router. It details the placement of MDX content, corresponding route files, and the `mdx-components` configuration for a structured project setup.

```txt
  .
  ├── markdown/
  │   └── welcome.(mdx/md)
  ├── pages/
  │   └── mdx-page.(tsx/js)
  ├── mdx-components.(tsx/js)
  └── package.json
```

--------------------------------

### Define Router-Specific Content in Next.js MDX

Source: https://github.com/vercel/next.js/blob/canary/docs/04-community/01-contribution-guide.mdx

Demonstrates how to use custom MDX components like `<PagesOnly>` and `<AppOnly>` to conditionally display content based on whether the documentation context is for the App Router or Pages Router, ensuring relevance for the reader.

```mdx
This content is shared between App and Pages.

<PagesOnly>

This content will only be shown on the Pages docs.

</PagesOnly>

This content is shared between App and Pages.
```

--------------------------------

### Configure Next.js Route Segment Runtime (TSX/JS)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/route-segment-config.mdx

This snippet demonstrates how to export a `runtime` constant in Next.js layout, page, or route files. It specifies whether the segment should run in a Node.js (default) or Edge environment. Using `'edge'` is not supported for Cache Components, and the Node.js runtime is generally recommended for rendering applications.

```tsx
export const runtime = 'nodejs'
// 'nodejs' | 'edge'
```

```js
export const runtime = 'nodejs'
// 'nodejs' | 'edge'
```

--------------------------------

### Basic Custom Image Loader Function

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/images.mdx

Create a custom image loader function that accepts src, width, and quality parameters and returns an optimized image URL string. This example shows the App Router version using 'use client' directive for Client Components.

```javascript
'use client'

export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

--------------------------------

### Generate Static Params for Dynamic Routes in Next.js

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.mdx

This example illustrates how to use the `generateStaticParams` function in Next.js to pre-render dynamic routes at build time, rather than on-demand. It fetches a list of posts from an API and maps them to an array of objects, where each object defines the `slug` parameter for a unique static page. Requests within this function are automatically deduplicated.

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

```jsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

--------------------------------

### Generate Static Params for a Subset of Dynamic Routes in Next.js

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/caching.mdx

Demonstrates how to use `generateStaticParams` to render a limited number of paths at build time, with the rest being rendered on the first visit at runtime. This optimizes build time while supporting a large number of dynamic routes.

```jsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  // Render the first 10 posts at build time
  return posts.slice(0, 10).map((post) => ({
    slug: post.slug,
  }))
}
```

--------------------------------

### Return static project info - TypeScript Route Handler

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/06-cache-components.mdx

Returns static data that can be pre-rendered at build time. No runtime dependencies; responds with a JSON object containing project metadata. Limitation: since the response is static, updates require a rebuild unless revalidation/tagging is used.

```TypeScript
export async function GET() {
  return Response.json({
    projectName: 'Next.js',
  })
}
```

--------------------------------

### Define Initial Next.js Optional Catch-all Route Page

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx

This code defines the initial 'page.tsx' or 'page.js' for an optional catch-all route '[[...slug]]' in Next.js. This configuration instructs Next.js to generate a single route for the empty slug ('/'), mapping all incoming requests to this page. It functions as a server component, prerendered into static HTML, and will be further updated to integrate client-side logic.

```tsx
export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // We'll update this
}
```

```jsx
export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // We'll update this
}
```

--------------------------------

### Generate Static Params for All Dynamic Routes in Next.js

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/caching.mdx

Illustrates how to use `generateStaticParams` to pre-render all possible paths for a dynamic route at build time. It fetches a list of posts and maps them to `slug` parameters for static generation.

```jsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

--------------------------------

### Configure Next.js Link Component for Proxy Prefetching (App Router)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/02-components/link.mdx

This example demonstrates how to use the Next.js <Link /> component within the App Router to correctly prefetch routes that are managed by a proxy. It dynamically sets the 'href' prop based on user authentication while maintaining a consistent 'as' prop ('/dashboard'), preventing redundant fetches to the proxy during prefetching.

```tsx
'use client'

import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed' // Your auth hook

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/public/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

```js
'use client'

import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed' // Your auth hook

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/public/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
