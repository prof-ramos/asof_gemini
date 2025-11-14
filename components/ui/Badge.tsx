import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span className={cn(
      "inline-block bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold tracking-wider uppercase text-primary rounded-sm",
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
