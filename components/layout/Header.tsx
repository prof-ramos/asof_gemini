'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import Button from '@/components/ui/Button';
import MobileMenu from './MobileMenu';

const Header = () => {
  const isScrolled = useScrollPosition(50);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleToggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(null);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-white/10 backdrop-blur-sm py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/asof-logo.svg"
            alt="ASOF Logo"
            width="32"
            height="32"
            className={`transition-all duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-90'
            }`}
          />
          <div>
            <h1
              className={`font-serif text-lg leading-none font-bold tracking-wide ${
                isScrolled ? 'text-primary' : 'text-white'
              }`}
            >
              {SITE_CONFIG.name}
            </h1>
            <p
              className={`text-[0.6rem] uppercase tracking-[0.2em] ${
                isScrolled ? 'text-primary-dark' : 'text-slate-300'
              }`}
            >
              Oficiais de Chancelaria
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className="relative">
                  <button
                    className={`flex items-center gap-2 text-sm uppercase tracking-widest font-medium hover:text-accent transition-colors ${
                      isScrolled ? 'text-primary' : 'text-white/90'
                    }`}
                    onClick={() => handleToggleDropdown(item.label)}
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                    aria-label={`Abrir menu ${item.label}`}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-md shadow-lg py-2 min-w-[200px]"
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      role="menu"
                      aria-label={`Submenu ${item.label}`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-primary hover:bg-slate-50 transition-colors"
                          onClick={handleCloseDropdown}
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm uppercase tracking-widest font-medium hover:text-accent transition-colors ${
                  isScrolled ? 'text-primary' : 'text-white/90'
                }`}
                onClick={handleCloseDropdown}
              >
                {item.label}
              </Link>
            );
          })}
          <Button variant={isScrolled ? 'primary' : 'highlight'} className="ml-4">
            Área do Associado
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden ${isScrolled ? 'text-primary' : 'text-white'}`}
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
