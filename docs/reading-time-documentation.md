# Reading Time Documentation

Biblioteca para calcular tempo estimado de leitura de textos.

## Uso Básico
```javascript
const readingTime = require('reading-time');

const text = 'This is a sample text to calculate reading time for.';
const stats = readingTime(text);

console.log(stats.text); // '1 min read'
console.log(stats.time); // 4521 (milliseconds)
console.log(stats.words); // 10
```

## Retorno da Função
- `text`: String formatada (ex: "3 min read")
- `time`: Tempo em milissegundos
- `words`: Número total de palavras
- `minutes`: Tempo em minutos (número)

## Personalização
Permite configurar palavras por minuto através de opções.
