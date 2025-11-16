import { cn } from '@/lib/utils';
import { CardProps } from '@/types';

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn(
      "bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
