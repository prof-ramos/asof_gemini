import { SectionProps } from '@/types';
import { cn } from '@/lib/utils';

const Section = ({ children, className, id }: SectionProps) => {
  return (
    <section id={id} className={cn("py-24", className)}>
      {children}
    </section>
  );
};

export default Section;
