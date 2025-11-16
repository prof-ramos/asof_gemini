declare module 'gray-matter' {
  export interface GrayMatterFile<T = Record<string, unknown>> {
    data: T;
    content: string;
    excerpt?: string;
    orig: Buffer | string;
    language: string;
    matter: string;
    stringify: (file?: GrayMatterFile) => string;
  }

  export interface GrayMatterOptions {
    excerpt?: boolean | ((input: string) => string);
    engines?: Record<string, unknown>;
    language?: string;
    delimiters?: string | [string, string];
  }

  export default function matter<T = Record<string, unknown>>(
    input: string | Buffer,
    options?: GrayMatterOptions
  ): GrayMatterFile<T>;
}
