# Gray Matter Documentation

Biblioteca para parsing de frontmatter em arquivos markdown.

## Uso Básico
```javascript
const matter = require('gray-matter');

const file = matter('---\ntitle: Hello\n---\n\nContent here');
console.log(file.data.title); // 'Hello'
console.log(file.content); // 'Content here'
```

## Suporte a Formatos
- YAML
- JSON
- TOML
- JavaScript

## Casos de Uso
- Extração de metadados de posts
- Configurações de páginas
- Dados estruturados em conteúdo
