### Compile MDX with Rehype and Remark Plugins

Source: https://github.com/mdx-js/mdx/blob/main/docs/packages/mdx.md

Demonstrates configuring MDX compilation with both rehype and remark plugins. Remark plugins process the Markdown AST, while rehype plugins process the HTML AST. The example shows adding `rehypeKatex` for math rendering and `remarkMath` for math syntax support, including options for plugins.

```tsx
import rehypeKatex from 'rehype-katex' // Render math with KaTeX.
import remarkMath from 'remark-math' // Support math like `$so$`.

await compile(file, {rehypePlugins: [rehypeKatex], remarkPlugins: [remarkMath]})

await compile(file, {
  // A plugin with options:
  rehypePlugins: [[rehypeKatex, {strict: true, throwOnError: true}]],
  remarkPlugins: [remarkMath]
})
```

--------------------------------

### Compile MDX with Remark Plugins

Source: https://github.com/mdx-js/mdx/blob/main/docs/packages/mdx.md

Shows how to integrate remark plugins into the MDX compilation process to extend Markdown parsing capabilities. Examples include adding GFM (GitHub Flavored Markdown) support and frontmatter parsing, demonstrating single plugins, multiple plugins, and plugins with custom options.

```tsx
import remarkFrontmatter from 'remark-frontmatter' // YAML and such.
import remarkGfm from 'remark-gfm' // Tables, footnotes, strikethrough, task lists, literal URLs.

await compile(file, {remarkPlugins: [remarkGfm]}) // One plugin.
await compile(file, {remarkPlugins: [[remarkFrontmatter, 'toml']]}) // A plugin with options.
await compile(file, {remarkPlugins: [remarkGfm, remarkFrontmatter]}) // Two plugins.
await compile(file, {remarkPlugins: [[remarkGfm, {singleTilde: false}], remarkFrontmatter]}) // Two plugins, first w/ options.
```

--------------------------------

### MDX Example with JSX in Markdown

Source: https://github.com/mdx-js/mdx/blob/main/docs/index.mdx

Demonstrates how to write markdown content with embedded JSX components in MDX. It shows importing a component and using it within the markdown, along with defining variables.

```mdx
import {Chart} from './snowfall.js'
export const year = 2023

# Last year's snowfall

In {year}, the snowfall was above average.
It was followed by a warm spring which caused
flood conditions in many of the nearby rivers.

<Chart color="#fcb32c" year={year} />
