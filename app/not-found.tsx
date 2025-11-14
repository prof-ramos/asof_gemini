import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral">
      <Container>
        <div className="text-center">
          <h1 className="text-9xl font-serif font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-serif text-primary-dark mb-6">
            Página não encontrada
          </h2>
          <p className="text-lg text-primary-dark mb-8 max-w-md mx-auto">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
          <Link href="/">
            <Button variant="primary">Voltar para a página inicial</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
