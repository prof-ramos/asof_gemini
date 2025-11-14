import Image from 'next/image';
import Link from 'next/link';
import { NewsCardProps } from '@/types';
import { formatDate } from '@/lib/utils';
import Badge from './Badge';

const NewsCard = ({ date, category, title, image, slug, excerpt }: NewsCardProps) => {
  return (
    <article className="group cursor-pointer">
      <Link href={`/noticias/${slug}`}>
        <div className="overflow-hidden mb-4 relative aspect-[4/3] rounded-sm">
          <Image
            src={image}
            alt={`Imagem ilustrativa: ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[0.2]"
          />
          <div className="absolute top-4 left-4">
            <Badge>{category}</Badge>
          </div>
        </div>
        <time
          dateTime={date}
          className="text-primary-dark text-xs font-bold uppercase tracking-widest mb-2 block"
        >
          {formatDate(date)}
        </time>
        <h3 className="text-xl font-serif font-medium text-primary leading-tight group-hover:text-accent transition-colors mb-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-primary-dark line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}
        <div className="w-8 h-[1px] bg-slate-300 group-hover:w-full group-hover:bg-accent transition-all duration-500"></div>
      </Link>
    </article>
  );
};

export default NewsCard;
