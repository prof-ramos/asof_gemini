import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';
import { BUTTON_HEIGHTS } from '@/lib/design-tokens';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  // Alturas fixas para consistência (sem py- para evitar alturas irregulares)
  // Mobile-first: garante 48px mínimo (atende iOS 44px e Android 48px)
  const sizes = {
    sm: `px-8 text-sm h-[${BUTTON_HEIGHTS.mobile.sm}]`,
    md: `px-10 text-base h-[${BUTTON_HEIGHTS.mobile.md}]`,
    lg: `px-12 text-lg h-[${BUTTON_HEIGHTS.mobile.lg}]`,
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
