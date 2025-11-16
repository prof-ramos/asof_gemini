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
      <nav aria-label="Navegação mobile" className="divide-y divide-slate-100">
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            return (
              <div key={`group-${item.label}`} className="py-4">
                <div className="text-primary text-sm uppercase tracking-widest font-medium mb-2">
                  {item.label}
                </div>
                <div className="space-y-2 pl-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="text-primary-dark text-base font-serif block hover:text-accent transition-colors"
                      onClick={onClose}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="text-primary py-4 border-t border-slate-100 text-lg font-serif block hover:text-accent transition-colors"
              onClick={onClose}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Button variant="primary" className="w-full mt-4">
        Área do Associado
      </Button>
    </div>
  );
};

export default MobileMenu;
