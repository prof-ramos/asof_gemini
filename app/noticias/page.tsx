import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import NewsCard from '@/components/ui/NewsCard';
import { getAllNews } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Acompanhe as últimas notícias, eventos e conquistas da ASOF.',
};

export default async function NoticiasPage() {
  const allNews = await getAllNews();

  const featured = allNews[0];
  const remainingNews = allNews.slice(1);

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Notícias
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Fique por dentro das últimas novidades, eventos e conquistas da ASOF.
            </p>
          </div>
        </Container>
      </Section>

      {/* Notícia em Destaque */}
      {featured && (
        <Section className="bg-white">
          <Container>
            <div className="mb-12">
              <h2 className="text-sm uppercase tracking-widest font-bold text-primary-dark mb-8">
                Destaque
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <NewsCard {...featured} />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4 leading-tight">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-lg text-primary-dark leading-relaxed mb-6">
                      {featured.excerpt}
                    </p>
                  )}
                  {featured.readingTime && (
                    <p className="text-sm text-slate-500">
                      Tempo de leitura: {featured.readingTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Todas as Notícias */}
      <Section className="bg-neutral">
        <Container>
          <h2 className="text-sm uppercase tracking-widest font-bold text-primary-dark mb-8">
            Todas as Notícias
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingNews.map((news) => (
              <NewsCard key={news.slug} {...news} />
            ))}
          </div>

          {remainingNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-primary-dark">
                Nenhuma notícia adicional disponível no momento.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
