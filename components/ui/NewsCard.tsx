'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NewsCardProps } from '@/types';
import { formatDate } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Badge from './Badge';

const NewsCard = ({ date, category, title, image, slug, excerpt }: NewsCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt máximo de 3° (muito sutil para site institucional)
    const rotateXValue = ((y - centerY) / centerY) * -3;
    const rotateYValue = ((x - centerX) / centerX) * 3;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  if (prefersReducedMotion) {
    return (
      <article className="group cursor-pointer h-full flex flex-col">
        <Link href={`/noticias/${slug}`} className="h-full flex flex-col">
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
            className="text-primary-dark text-sm font-bold uppercase tracking-widest mb-2 block"
          >
            {formatDate(date)}
          </time>
          <h3 className="text-xl font-serif font-medium text-primary leading-tight group-hover:text-accent transition-colors mb-2">
            {title}
          </h3>
          {excerpt && <p className="text-base text-primary-dark line-clamp-2 mb-4">{excerpt}</p>}
          <div className="w-8 h-[1px] bg-slate-300 group-hover:w-full group-hover:bg-accent transition-all duration-500"></div>
        </Link>
      </article>
    );
  }

  return (
    <motion.article
      className="group cursor-pointer h-full flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ y: -8, scale: 1.01 }}
    >
      <Link href={`/noticias/${slug}`} className="h-full flex flex-col">
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
          className="text-primary-dark text-sm font-bold uppercase tracking-widest mb-2 block"
        >
          {formatDate(date)}
        </time>
        <h3 className="text-xl font-serif font-medium text-primary leading-tight group-hover:text-accent transition-colors mb-2">
          {title}
        </h3>
        {excerpt && <p className="text-base text-primary-dark line-clamp-2 mb-4">{excerpt}</p>}
        <div className="w-8 h-[1px] bg-slate-300 group-hover:w-full group-hover:bg-accent transition-all duration-500"></div>
      </Link>
    </motion.article>
  );
};

export default NewsCard;
