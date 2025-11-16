'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import Button from '@/components/ui/Button';
import MobileMenu from './MobileMenu';

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isScrolled = useScrollPosition(50);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Em subpáginas, sempre usar estilo "scrolled" (texto escuro)
  // Na home page, usar estilo baseado no scroll
  const shouldUseDarkText = !isHomePage || isScrolled;

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        shouldUseDarkText ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-colors ${
              shouldUseDarkText ? 'border-primary text-primary' : 'border-white text-white'
            }`}
          >
            <Globe size={20} aria-hidden="true" />
          </div>
          <div>
            <h1
              className={`font-serif text-lg leading-none font-bold tracking-wide ${
                shouldUseDarkText ? 'text-primary' : 'text-white'
              }`}
            >
              {SITE_CONFIG.name}
            </h1>
            <p
              className={`text-[0.6rem] uppercase tracking-[0.2em] ${
                shouldUseDarkText ? 'text-primary-dark' : 'text-slate-300'
              }`}
            >
              Oficiais de Chancelaria
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm uppercase tracking-widest font-medium hover:text-accent transition-colors ${
                shouldUseDarkText ? 'text-primary' : 'text-white/90'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button variant={shouldUseDarkText ? 'primary' : 'highlight'} className="ml-4">
            Área do Associado
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden ${shouldUseDarkText ? 'text-primary' : 'text-white'}`}
          onClick={handleToggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} />
    </header>
  );
};

export default Header;
