import { LucideIcon } from 'lucide-react';

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const IconCard = ({ icon: Icon, title, description }: IconCardProps) => {
  return (
    <div className="bg-white p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-transparent hover:border-accent group rounded-sm h-full flex flex-col">
      <div className="w-8 h-8 bg-neutral rounded-full flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300 shrink-0">
        <Icon className="text-primary-dark group-hover:text-white transition-colors" size={24} />
      </div>
      <h3 className="text-xl font-serif font-bold mb-4 text-primary">{title}</h3>
      <p className="text-slate-700 leading-relaxed font-light text-base">{description}</p>
    </div>
  );
};

export default IconCard;
