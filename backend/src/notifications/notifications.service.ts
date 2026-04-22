import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  private readonly smtpPort = Number(process.env.SMTP_PORT || 587);
  private readonly smtpSecure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  private readonly smtpUser = process.env.SMTP_USER?.trim();
  private readonly smtpPass = process.env.SMTP_PASS?.trim();
  private readonly fromEmail = process.env.SMTP_FROM?.trim() || this.smtpUser || 'no-reply@pannonbolt.local';
  private readonly notifyOverrideTo = process.env.MOCK_PAYMENT_NOTIFY_TO?.trim();

  private getTransporter() {
    if (!this.smtpUser || !this.smtpPass) {
      return null;
    }

    return nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpSecure,
      auth: {
        user: this.smtpUser,
        pass: this.smtpPass,
      },
    });
  }

  async sendMockPaymentEmail(params: {
    orderId: number;
    recipientEmail: string;
    recipientName?: string | null;
    totalPrice: number;
    itemCount: number;
    lineCount?: number;
    courier?: string | null;
    createdAt?: Date;
    trackingNumber?: string | null;
    shippingAddress?: string | null;
    items?: Array<{ name: string; quantity: number; price: number }>;
  }): Promise<{ emailSent: boolean; reason?: string }> {
    const to = this.notifyOverrideTo || params.recipientEmail;
    if (!to) {
      return { emailSent: false, reason: 'No recipient email available' };
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      console.warn('SMTP not configured, skipping mock payment email.');
      return { emailSent: false, reason: 'SMTP credentials are missing' };
    }

    const displayName = params.recipientName?.trim() || 'Customer';
    const subject = `Payment confirmed for order #${params.orderId}`;
    const orderDate = (params.createdAt || new Date()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    const totalPrice = `$${params.totalPrice.toFixed(2)}`;
    const lineCount = params.lineCount ?? params.itemCount;
    const itemRows = params.items && params.items.length > 0
      ? params.items.map((item) => `
        <tr>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;">${item.name}</td>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;text-align:center;">x${item.quantity}</td>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')
      : '';

    const text = [
      `Hi ${displayName},`,
      '',
      `Your mock payment for order #${params.orderId} was successful.`,
      `Items: ${params.itemCount}`,
      `Product lines: ${lineCount}`,
      `Total: ${totalPrice}`,
      `Courier: ${params.courier || 'UPS'}`,
      params.trackingNumber ? `Tracking: ${params.trackingNumber}` : '',
      params.shippingAddress ? `Shipping: ${params.shippingAddress}` : '',
      `Order date: ${orderDate}`,
      '',
      'This is a demo notification email from PannonBolt.',
    ].filter(Boolean).join('\n');

    const html = `
      <div style="margin:0;padding:24px;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;color:#10243f;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(16,36,63,0.12);">
          <tr>
            <td style="background:linear-gradient(120deg,#0f766e,#2563eb);padding:28px 28px 20px 28px;color:#ffffff;">
              <div style="font-size:13px;opacity:0.9;letter-spacing:0.08em;text-transform:uppercase;">PannonBolt Mock Checkout</div>
              <h1 style="margin:10px 0 0 0;font-size:24px;line-height:1.3;">Payment Successful</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 6px 28px;font-size:16px;line-height:1.6;">
              Hi <strong>${displayName}</strong>, your mock payment for order <strong>#${params.orderId}</strong> was successful.
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 20px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #d9e3f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:12px 14px;background:#f8fbff;color:#4b647f;font-size:13px;">Order Date</td>
                  <td style="padding:12px 14px;background:#f8fbff;text-align:right;font-weight:600;">${orderDate}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;color:#4b647f;font-size:13px;border-top:1px solid #e7edf7;">Items</td>
                  <td style="padding:12px 14px;text-align:right;font-weight:600;border-top:1px solid #e7edf7;">${params.itemCount}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;color:#4b647f;font-size:13px;border-top:1px solid #e7edf7;">Product Lines</td>
                  <td style="padding:12px 14px;text-align:right;font-weight:600;border-top:1px solid #e7edf7;">${lineCount}</td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;color:#4b647f;font-size:13px;border-top:1px solid #e7edf7;">Courier</td>
                  <td style="padding:12px 14px;text-align:right;font-weight:600;border-top:1px solid #e7edf7;">${params.courier || 'UPS'}</td>
                </tr>
                ${params.trackingNumber ? `
                <tr>
                  <td style="padding:12px 14px;color:#4b647f;font-size:13px;border-top:1px solid #e7edf7;">Tracking</td>
                  <td style="padding:12px 14px;text-align:right;font-weight:600;border-top:1px solid #e7edf7;">${params.trackingNumber}</td>
                </tr>
                ` : ''}
                ${params.shippingAddress ? `
                <tr>
                  <td style="padding:12px 14px;color:#4b647f;font-size:13px;border-top:1px solid #e7edf7;">Shipping</td>
                  <td style="padding:12px 14px;text-align:right;font-weight:600;border-top:1px solid #e7edf7;">${params.shippingAddress}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding:14px;color:#0f172a;font-size:14px;font-weight:700;border-top:1px solid #e7edf7;">Total</td>
                  <td style="padding:14px;text-align:right;color:#0f172a;font-size:18px;font-weight:800;border-top:1px solid #e7edf7;">${totalPrice}</td>
                </tr>
              </table>
            </td>
          </tr>
          ${itemRows ? `
          <tr>
            <td style="padding:0 28px 20px 28px;">
              <h2 style="margin:0 0 10px 0;font-size:18px;color:#10243f;">Order Items</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #d9e3f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <th align="left" style="padding:10px 14px;background:#f8fbff;color:#4b647f;font-size:12px;font-weight:700;">Item</th>
                  <th align="center" style="padding:10px 14px;background:#f8fbff;color:#4b647f;font-size:12px;font-weight:700;">Qty</th>
                  <th align="right" style="padding:10px 14px;background:#f8fbff;color:#4b647f;font-size:12px;font-weight:700;">Subtotal</th>
                </tr>
                ${itemRows}
              </table>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding:0 28px 28px 28px;font-size:13px;color:#5f738c;line-height:1.6;">
              This is a demo notification email from PannonBolt. No real payment was processed.
            </td>
          </tr>
        </table>
      </div>
    `;

    await transporter.sendMail({
      from: this.fromEmail,
      to,
      subject,
      text,
      html,
    });

    return { emailSent: true };
  }
}
