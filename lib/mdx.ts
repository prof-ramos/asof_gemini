import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content/noticias');

// In-memory cache para performance
// Em produção, usar Redis ou similar para shared cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 3600000; // 1 hora em ms

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

export const getAllNews = async (): Promise<NewsMetadata[]> => {
  const cacheKey = 'news:all';
  const now = Date.now();

  // Verificar cache válido
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const files = fs.readdirSync(contentDirectory);

    const news = files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const slug = file.replace(/\.mdx$/, '');
        const filePath = path.join(contentDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        const readTime = readingTime(content);

        return {
          ...data,
          slug,
          readingTime: readTime.text,
        } as NewsMetadata;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Cache resultado
    cache.set(cacheKey, { data: news, timestamp: now });

    return news;
  } catch (error) {
    console.error('Error reading news:', error);
    return [];
  }
};

export const getNewsBySlug = async (slug: string): Promise<NewsPost | null> => {
  const cacheKey = `news:${slug}`;
  const now = Date.now();

  // Verificar cache válido
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const readTime = readingTime(content);

    const post = {
      ...data,
      slug,
      content,
      readingTime: readTime.text,
    } as NewsPost;

    // Cache resultado
    cache.set(cacheKey, { data: post, timestamp: now });

    return post;
  } catch (error) {
    console.error(`Error reading news ${slug}:`, error);
    return null;
  }
};

export const generateNewsStaticParams = async () => {
  const news = await getAllNews();
  return news.map((post) => ({
    slug: post.slug,
  }));
};
