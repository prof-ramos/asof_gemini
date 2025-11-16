import { ReactNode } from 'react';

// Component Props
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

// Content & Data Types
export interface NewsMetadata {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  author: string;
  image: string;
  slug: string;
  readingTime?: string;
}

export interface NewsPost extends NewsMetadata {
  content: string;
}

// Site Configuration Types
export interface SiteConfig {
  name: string;
  fullName: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
}
