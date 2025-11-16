import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent';
}

const Badge = ({ children, className, variant = 'default' }: BadgeProps) => {
  const variants = {
    default: 'bg-white/90 backdrop-blur-sm text-primary',
    accent: 'bg-accent text-primary',
  };

  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-sm font-bold tracking-wider uppercase rounded-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
