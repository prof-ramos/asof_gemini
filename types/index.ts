import { ReactNode } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'highlight' | 'ghost';
  children: ReactNode;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface NewsCardProps {
  date: string;
  category: string;
  title: string;
  image: string;
  slug: string;
  excerpt?: string;
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}
