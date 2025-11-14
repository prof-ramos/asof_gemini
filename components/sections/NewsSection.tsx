import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import NewsCard from '@/components/ui/NewsCard';
import Button from '@/components/ui/Button';

const NewsSection = () => {
  const newsData = [
    {
      image:
        'https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=2070&auto=format&fit=crop',
      category: 'Carreira',
      date: '2024-05-12',
      title: 'Avanços na negociação salarial: Nova proposta apresentada ao MGI.',
      slug: 'avanco-negociacao-salarial',
      excerpt: 'ASOF apresenta proposta de reajuste salarial ao Ministério da Gestão e Inovação.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      category: 'Eventos',
      date: '2024-05-08',
      title: 'ASOF promove encontro sobre saúde mental no serviço exterior.',
      slug: 'encontro-saude-mental',
      excerpt: 'Evento discute desafios e soluções para bem-estar dos oficiais de chancelaria.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      category: 'Institucional',
      date: '2024-04-25',
      title: 'Eleições da Diretoria 2025-2027: Confira o edital completo.',
      slug: 'eleicoes-diretoria-2025',
      excerpt: 'Processo eleitoral define novos rumos da associação para o próximo biênio.',
    },
  ];

  return (
    <Section className="bg-white" id="noticias">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-primary-dark font-bold text-sm tracking-[0.2em] uppercase mb-2">
              Atualizações
            </h3>
            <h2 className="text-3xl md:text-4xl font-serif text-primary">
              Notícias Recentes
            </h2>
          </div>
          <Link
            href="/noticias"
            className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest font-medium text-slate-500 hover:text-accent transition-colors"
          >
            Ver todas <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsData.map((news, idx) => (
            <NewsCard key={idx} {...news} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link href="/noticias">
            <Button variant="outline">Ver todas as notícias</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default NewsSection;
