import Link from 'next/link';
import { Globe, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-neutral/70 pt-20 pb-8 border-t border-primary-dark">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-4 text-white mb-6">
              <Globe size={24} aria-hidden="true" />
              <h2 className="font-serif text-xl font-bold">ASOF</h2>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              {SITE_CONFIG.fullName}.
            </p>
            <div className="flex gap-4">
              <a
                href={SITE_CONFIG.links.instagram}
                className="w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center text-white/70 hover:bg-accent hover:text-primary transition-colors cursor-pointer text-xs font-bold"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href={SITE_CONFIG.links.twitter}
                className="w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center text-white/70 hover:bg-accent hover:text-primary transition-colors cursor-pointer text-xs font-bold"
                aria-label="Twitter"
              >
                TW
              </a>
              <a
                href={SITE_CONFIG.links.linkedin}
                className="w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center text-white/70 hover:bg-accent hover:text-primary transition-colors cursor-pointer text-xs font-bold"
                aria-label="LinkedIn"
              >
                LI
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/sobre" className="hover:text-accent transition-colors">
                  Sobre a ASOF
                </Link>
              </li>
              <li>
                <Link href="/sobre#estatuto" className="hover:text-accent transition-colors">
                  Estatuto Social
                </Link>
              </li>
              <li>
                <Link href="/transparencia" className="hover:text-accent transition-colors">
                  Portal da Transparência
                </Link>
              </li>
              <li>
                <Link href="/atuacao#beneficios" className="hover:text-accent transition-colors">
                  Clube de Benefícios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6">Contato</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="mt-1 text-accent shrink-0" aria-hidden="true" />
                <span>
                  {SITE_CONFIG.contact.address}
                  <br />
                  {SITE_CONFIG.contact.city}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-accent shrink-0" aria-hidden="true" />
                <a href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, '')}`} className="hover:text-accent transition-colors">
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-accent shrink-0" aria-hidden="true" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-accent transition-colors">
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6">Informativo</h4>
            <p className="text-xs mb-4">Receba as principais notícias da carreira no seu e-mail.</p>
            <div className="flex">
              <label htmlFor="newsletter-email" className="sr-only">
                Seu e-mail
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Seu e-mail"
                className="bg-primary-dark border-none text-white text-sm px-4 py-2 w-full focus:ring-1 focus:ring-accent outline-none rounded-l-sm placeholder:text-neutral/50"
                aria-label="Inscrever-se na newsletter"
                readOnly
              />
              <div
                className="bg-accent text-primary px-4 flex items-center justify-center hover:bg-accent/90 transition-colors rounded-r-sm cursor-pointer"
                aria-label="Enviar"
              >
                <ArrowRight size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-dark pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide">
          <p>&copy; {currentYear} {SITE_CONFIG.name}. Todos os direitos reservados.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
