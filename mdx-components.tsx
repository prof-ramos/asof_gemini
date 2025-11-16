/**
 * MDX Components Configuration
 *
 * This file must remain in the project root as per Next.js conventions.
 * Next.js automatically discovers and uses this file for MDX component customization.
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

export const useMDXComponents = (components: MDXComponents): MDXComponents => {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-serif font-bold text-primary mb-6 mt-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-serif font-bold text-primary mb-4 mt-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-serif font-semibold text-primary-dark mb-3 mt-5">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-lg leading-relaxed text-primary-dark mb-4">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href || '#'}
        className="text-accent hover:text-accent-light underline transition-colors"
      >
        {children}
      </Link>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-6 py-2 my-6 italic text-primary-dark bg-neutral/30">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-primary-dark">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-primary-dark">
        {children}
      </ol>
    ),
    img: ({ src, alt }) => (
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={600}
        className="rounded-sm my-6 w-full h-auto"
      />
    ),
    ...components,
  };
};
