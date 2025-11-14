import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyle = "px-8 py-4 rounded-sm transition-all duration-300 font-medium tracking-wide text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark hover:shadow-lg border border-transparent",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white",
    highlight: "bg-accent text-primary hover:bg-primary-dark hover:text-white border border-transparent font-bold",
    ghost: "bg-white text-primary border-white hover:bg-transparent hover:text-white"
  };

  return (
    <button
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
