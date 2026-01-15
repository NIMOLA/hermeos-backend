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
    async sendCoopInvestmentConfirmation(to: string, userName: string, amount: number, slots: number, membershipId: string, projectName: string) {
        const date = new Date().toLocaleDateString();
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1>Welcome to Iré Portfolio: Your Ownership & Membership Confirmed 🏠✅</h1>
                <p>Dear ${userName},</p>
                
                <p>Congratulations! Your subscription to the Iré Portfolio has been successfully processed. You have not just acquired a beneficial interest in a prime asset; you have formally joined a community dedicated to building wealth through cooperative ownership.</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                
                <h3>Transaction Summary:</h3>
                <ul>
                    <li><strong>Project:</strong> ${projectName}</li>
                    <li><strong>Slots:</strong> ${slots} Slots</li>
                    <li><strong>Contribution:</strong> ₦${amount.toLocaleString()}</li>
                    <li><strong>Date:</strong> ${date}</li>
                </ul>
                
                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; border: 1px solid #bbf7d0; margin: 20px 0;">
                    <h3>Important: Your Cooperative Membership</h3>
                    <p>As part of this allocation, your membership with the Manymiles Cooperative Multipurpose Society (the asset issuer) has been activated.</p>
                    <ul>
                        <li><strong>Membership ID:</strong> ${membershipId}</li>
                        <li><strong>Status:</strong> Active Co-operator</li>
                    </ul>
                </div>
                
                <p><strong>Next Steps:</strong><br/>
                Your official Slot Certificate is being generated on the blockchain and will be available in your dashboard within 24 hours.</p>
                
                <p>Warm regards,<br/>
                The Hermeos Team<br/>
                (Technical Partner for Manymiles Cooperative Multipurpose Society)</p>
            </div>
        `;
        await this.sendEmail(to, 'Welcome to Iré Portfolio: Your Ownership & Membership Confirmed 🏠✅', html);
    }
}

export const emailService = new EmailService();
