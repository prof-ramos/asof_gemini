import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  const sizes = {
    sm: 'px-8 py-3 text-sm min-h-[48px]',
    md: 'px-10 py-4 text-base min-h-[50px]',
    lg: 'px-12 py-4 text-lg min-h-[52px]',
  };

  const baseStyle =
    'rounded-sm transition-all duration-300 font-medium tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark hover:shadow-lg border border-transparent focus:ring-2 focus:ring-primary focus:ring-offset-2',
    outline:
      'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary focus:ring-offset-2',
    highlight:
      'bg-accent text-primary hover:bg-primary-dark hover:text-white border border-transparent font-bold focus:ring-2 focus:ring-primary focus:ring-offset-2',
    ghost:
      'bg-white text-primary border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-primary focus:ring-offset-2',
  };

  return (
    <Comp
      className={cn(baseStyle, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Button;
