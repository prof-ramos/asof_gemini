import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { getNewsBySlug, generateNewsStaticParams, getAllNews } from '@/lib/mdx';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import NewsCard from '@/components/ui/NewsCard';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return await generateNewsStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);

  if (!post) {
    return {
      title: 'Notícia não encontrada',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: [post.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related news (same category)
  const allNews = await getAllNews();
  const relatedNews = allNews
    .filter((n) => n.category === post.category && n.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-24">
      {/* Back Button */}
      <Section className="bg-white py-6 border-b">
        <Container>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-primary-dark hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="text-sm font-medium">Voltar para Notícias</span>
          </Link>
        </Container>
      </Section>

      {/* Article Header */}
      <Section className="bg-white pt-12">
        <Container>
          <article className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-6">
              <Badge>{post.category}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-primary-dark mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-accent" aria-hidden="true" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-accent" aria-hidden="true" />
                <span>{post.author}</span>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-accent" aria-hidden="true" />
                  <span>{post.readingTime}</span>
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div className="relative w-full aspect-[16/9] mb-12 rounded-sm overflow-hidden">
              <Image
                src={post.image}
                alt={`Imagem ilustrativa: ${post.title}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <MDXRemote source={post.content} />
            </div>

            {/* Share & Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-200">
              <Link
                href="/noticias"
                className="text-accent hover:text-accent-light font-medium transition-colors"
              >
                ← Voltar para todas as notícias
              </Link>
              <div className="flex gap-4">
                <button
                  className="text-primary-dark hover:text-accent transition-colors"
                  aria-label="Compartilhar no Twitter"
                >
                  Compartilhar
                </button>
              </div>
            </div>
          </article>
        </Container>
      </Section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <Section className="bg-neutral">
          <Container>
            <h2 className="text-3xl font-serif font-bold text-primary mb-8">
              Notícias Relacionadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedNews.map((news) => (
                <NewsCard key={news.slug} {...news} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
}
