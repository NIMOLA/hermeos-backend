import nodemailer from 'nodemailer';
import { AppError } from '../middleware/errorHandler';

class EmailService {
    private transporter;

    constructor() {
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            // Mock transporter or null - log warning
            console.warn('SMTP credentials missing. Email service disabled.');
        }
    }

    async sendEmail(to: string, subject: string, html: string) {
        if (!this.transporter) {
            console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Hermeos Support" <support@hermeos.com>',
                to,
                subject,
                html
            });
        } catch (error) {
            console.error('Email send failed:', error);
            // Don't throw to avoid blocking main flow, but log error
        }
    }

    // Templates
    async sendWelcomeEmail(to: string, name: string) {
        const html = `
            <h1>Welcome to Hermeos, ${name}!</h1>
            <p>Thank you for joining our platform. We are excited to have you on board.</p>
            <p>You can now start browsing our premium real estate listings.</p>
        `;
        await this.sendEmail(to, 'Welcome to Hermeos', html);
    }

    async sendKYCStatusUpdate(to: string, name: string, status: string, reason?: string) {
        const title = status === 'APPROVED' ? 'KYC Approved' : 'KYC Update';
        const content = status === 'APPROVED'
            ? 'Congratulations! Your identity verification has been approved. You can now invest.'
            : `Your KYC status has been updated to: ${status}. ${reason ? `Reason: ${reason}` : ''}`;

        const html = `
            <h1>${title}</h1>
            <p>Dear ${name},</p>
            <p>${content}</p>
        `;
        await this.sendEmail(to, `Update on your KYC Status`, html);
    }

    async sendExitRequestReceived(to: string, units: number) {
        const html = `
            <h1>Exit Request Received</h1>
            <p>We have received your request to exit/transfer ${units} units.</p>
            <p>Our team will review this shortly.</p>
        `;
        await this.sendEmail(to, 'Exit Request Received', html);
    }
}

export const emailService = new EmailService();
