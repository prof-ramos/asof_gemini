'use client';

import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import Button from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu"
      className="absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl py-6 px-6 flex flex-col gap-4 md:hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação mobile"
    >
      <nav aria-label="Navegação mobile">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-primary py-2 border-b border-slate-100 text-lg font-serif block hover:text-accent transition-colors"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Button variant="primary" className="w-full mt-4">
        Área do Associado
      </Button>
    </div>
  );
};

export default MobileMenu;
