import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Tipos para o request body
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Validação de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitização básica (prevenir XSS)
function sanitize(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(request: Request) {
  try {
    // Parse do body
    const body: ContactFormData = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validações
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando. Por favor, preencha nome, email, assunto e mensagem.' },
        { status: 400 }
      );
    }

    // Validar formato do email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido. Por favor, insira um email válido.' },
        { status: 400 }
      );
    }

    // Validar tamanhos
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Nome muito longo. Máximo 100 caracteres.' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Mensagem muito longa. Máximo 5000 caracteres.' },
        { status: 400 }
      );
    }

    // Verificar se SMTP está configurado
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('❌ SMTP não configurado. Verifique variáveis de ambiente.');

      // Em desenvolvimento, apenas logar
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email simulado (SMTP não configurado):');
        console.log('  De:', email);
        console.log('  Para:', smtpFrom || 'contato@asof.org.br');
        console.log('  Assunto:', subject);
        console.log('  Mensagem:', message);

        return NextResponse.json({
          success: true,
          message: 'Mensagem recebida! (Modo desenvolvimento - email não enviado)',
        });
      }

      return NextResponse.json(
        { error: 'Serviço de email temporariamente indisponível. Tente novamente mais tarde.' },
        { status: 503 }
      );
    }

    // Configurar transporter do nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465, // true para porta 465, false para outras
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Sanitizar inputs para prevenir XSS
    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safePhone = phone ? sanitize(phone) : 'Não informado';
    const safeSubject = sanitize(subject);
    const safeMessage = sanitize(message);

    // Montar email HTML
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #040920;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f4f4f4;
            padding: 20px;
            border-radius: 0 0 5px 5px;
          }
          .field {
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border-radius: 3px;
          }
          .field-label {
            font-weight: bold;
            color: #040920;
            margin-bottom: 5px;
          }
          .field-value {
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nova Mensagem do Site ASOF</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Nome:</div>
              <div class="field-value">${safeName}</div>
            </div>
            <div class="field">
              <div class="field-label">Email:</div>
              <div class="field-value">${safeEmail}</div>
            </div>
            <div class="field">
              <div class="field-label">Telefone:</div>
              <div class="field-value">${safePhone}</div>
            </div>
            <div class="field">
              <div class="field-label">Assunto:</div>
              <div class="field-value">${safeSubject}</div>
            </div>
            <div class="field">
              <div class="field-label">Mensagem:</div>
              <div class="field-value" style="white-space: pre-wrap;">${safeMessage}</div>
            </div>
          </div>
          <div class="footer">
            <p>Esta mensagem foi enviada através do formulário de contato do site ASOF.</p>
            <p>Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email em texto plano (fallback)
    const textEmail = `
Nova Mensagem do Site ASOF

Nome: ${safeName}
Email: ${safeEmail}
Telefone: ${safePhone}
Assunto: ${safeSubject}

Mensagem:
${safeMessage}

---
Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
    `;

    // Enviar email
    const info = await transporter.sendMail({
      from: smtpFrom || smtpUser,
      to: smtpFrom || 'contato@asof.org.br',
      replyTo: email, // Responder direto para quem enviou
      subject: `[ASOF Site] ${safeSubject} - ${safeName}`,
      text: textEmail,
      html: htmlEmail,
    });

    console.log('✅ Email enviado com sucesso:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Retornaremos em breve.',
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);

    // Se for erro de autenticação SMTP
    if (error instanceof Error && error.message.includes('auth')) {
      return NextResponse.json(
        { error: 'Erro de configuração do servidor. Por favor, tente novamente mais tarde.' },
        { status: 503 }
      );
    }

    // Erro genérico
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}

// Método não permitido
export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  );
}
