# Lucide React Icons Documentation

Biblioteca de ícones para React baseada no Lucide Icons.
Principais usos incluem componentes de UI, botões, navegação e elementos visuais.

## Uso Básico
```tsx
import { Heart, Star, User } from 'lucide-react'

function MyComponent() {
  return (
    <div>
      <Heart size={20} color="red" />
      <Star fill="gold" />
      <User className="custom-class" />
    </div>
  )
}
```

## Tipos de Ícones Disponíveis
- Outline (padrão)
- Filled
- Sizes customizáveis
- Cores customizáveis
- Classes CSS customizáveis
