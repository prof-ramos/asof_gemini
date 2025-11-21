'use client';

import { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitStatus('error');
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-2">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              placeholder="(61) 99999-9999"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-primary mb-2">
              Assunto *
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
            >
              <option value="">Selecione um assunto</option>
              <option value="associacao">Quero me associar</option>
              <option value="duvida">Dúvida geral</option>
              <option value="sugestao">Sugestão</option>
              <option value="reclamacao">Reclamação</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-primary mb-2">
            Mensagem *
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
            placeholder="Digite sua mensagem..."
          />
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-sm">
            Mensagem enviada com sucesso! Retornaremos em breve.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm">
            {errorMessage || 'Erro ao enviar mensagem. Tente novamente.'}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>
      </form>
    </Card>
  );
};

export default ContactForm;
