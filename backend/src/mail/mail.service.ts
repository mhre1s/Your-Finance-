import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn(
        '⚠️ RESEND_API_KEY não configurada. Os e-mails serão exibidos no console para desenvolvimento local.',
      );
    }
  }

  /**
   * Envia o e-mail de recuperação de senha com botão e link estilizados
   */
  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    // Fallback de desenvolvimento caso a chave do Resend não esteja presente
    if (!this.resend) {
      console.log('\n📧 ================= [RECUPERAÇÃO DE SENHA] =================');
      console.log(`Destinatário: ${name} <${to}>`);
      console.log(`Link de Redefinição: ${resetUrl}`);
      console.log('Válido por: 15 minutos');
      console.log('============================================================\n');
      return;
    }

    try {
      await this.resend.emails.send({
        from: 'Your Finances <onboarding@resend.dev>',
        to,
        subject: 'Recuperação de Senha — Your Finances',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #0f172a; font-size: 24px; margin: 0;">Your Finance<span style="color: #10b981;">$</span></h1>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Controle Financeiro Pessoal</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">Olá, ${name}!</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Recebemos uma solicitação para redefinir a sua senha no Your Finances.
              </p>
              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Clique no botão abaixo para escolher uma nova senha. <strong>Este link expira em 15 minutos</strong>.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                  Redefinir Minha Senha
                </a>
              </div>
              
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
                Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:<br />
                <a href="${resetUrl}" style="color: #10b981;">${resetUrl}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Se você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança. Sua senha atual permanecerá inalterada.
              </p>
            </div>
          </div>
        `,
      });
      this.logger.log(`E-mail de recuperação enviado com sucesso para ${to}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar e-mail via Resend para ${to}:`,
        error instanceof Error ? error.message : error,
      );
      // Logamos no console para não deixar o usuário sem o link em caso de erro no envio
      console.log(`\n🔗 Link alternativo de redefinição: ${resetUrl}\n`);
    }
  }
}
