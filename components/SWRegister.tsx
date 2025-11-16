'use client';

import { useEffect } from 'react';

export default function SWRegister() {
  useEffect(() => {
    // Só registrar SW em produção
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
          console.log('Falha ao registrar SW:', error);
        });
    }
  }, []);

  return null;
}
