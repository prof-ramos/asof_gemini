import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { NewsMetadata, NewsPost } from '@/types';

const contentDirectory = path.join(process.cwd(), 'content/noticias');

export const getAllNews = async (): Promise<NewsMetadata[]> => {
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

    return news;
  } catch (error) {
    console.error('Error reading news:', error);
    return [];
  }
};

export const getNewsBySlug = async (slug: string): Promise<NewsPost | null> => {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const readTime = readingTime(content);

    return {
      ...data,
      slug,
      content,
      readingTime: readTime.text,
    } as NewsPost;
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
