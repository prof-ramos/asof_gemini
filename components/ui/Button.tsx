import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const sizes = {
    sm: "px-6 py-2 text-sm min-h-[40px]",
    md: "px-8 py-3 text-base min-h-[44px]",
    lg: "px-12 py-4 text-lg min-h-[48px]"
  };

  const baseStyle = "rounded-sm transition-all duration-300 font-medium tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark hover:shadow-lg border border-transparent focus:ring-2 focus:ring-primary focus:ring-offset-2",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary focus:ring-offset-2",
    highlight: "bg-accent text-primary hover:bg-primary-dark hover:text-white border border-transparent font-bold focus:ring-2 focus:ring-primary focus:ring-offset-2",
    ghost: "bg-white text-primary border-white hover:bg-transparent hover:text-white focus:ring-2 focus:ring-primary focus:ring-offset-2"
  };

  return (
    <button
      className={cn(baseStyle, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
