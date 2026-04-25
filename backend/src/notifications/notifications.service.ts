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
    language?: 'hu' | 'en';
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

    const language = params.language === 'en' ? 'en' : 'hu';
    const isEnglish = language === 'en';
    const locale = isEnglish ? 'en-US' : 'hu-HU';
    const currencyLabel = isEnglish ? '$' : 'Ft';

    const labels = isEnglish
      ? {
          subject: `Payment confirmed for order #${params.orderId}`,
          fallbackName: 'Customer',
          hello: 'Hi',
          intro: `Your mock payment for order #${params.orderId} was successful.`,
          items: 'Items',
          productLines: 'Product lines',
          total: 'Total',
          courier: 'Courier',
          tracking: 'Tracking',
          shipping: 'Shipping',
          orderDate: 'Order date',
          title: 'Payment Successful!',
          orderTitle: 'Order',
          support: 'If you have any questions, please contact our support team.',
          mockFooter: 'This is a mock payment confirmation from ShopHub.',
          orderItems: 'Order Items',
          product: 'Product',
          quantity: 'Qty',
          subtotal: 'Subtotal',
          whatNext: 'What Happens Next?',
          next1: 'Your order is being prepared for shipment',
          next2: 'You will receive tracking updates via email',
          next3: 'View your order status anytime in your account',
        }
      : {
          subject: `Fizetes visszaigazolva - rendeles #${params.orderId}`,
          fallbackName: 'Vasarlo',
          hello: 'Szia',
          intro: `A rendeles #${params.orderId} tesztfizetese sikeres volt.`,
          items: 'Tetelek',
          productLines: 'Termeksorok',
          total: 'Vegosszeg',
          courier: 'Futarszolgalat',
          tracking: 'Kovetesi szam',
          shipping: 'Szallitasi cim',
          orderDate: 'Rendeles datuma',
          title: 'Sikeres fizetes!',
          orderTitle: 'Rendeles',
          support: 'Kerdes eseten fordulj ugyfelszolgalatunkhoz.',
          mockFooter: 'Ez egy teszt fizetesi visszaigazolo e-mail a ShopHub rendszeretol.',
          orderItems: 'Rendeles tetelei',
          product: 'Termek',
          quantity: 'Db',
          subtotal: 'Reszosszeg',
          whatNext: 'Mi tortenik ezutan?',
          next1: 'A rendelesedet elokeszitjuk szallitasra',
          next2: 'A kovetesi frissiteseket e-mailben kuldjuk',
          next3: 'A rendeles allapotat a fiokodban barmikor megnezheted',
        };

    const displayName = params.recipientName?.trim() || labels.fallbackName;
    const subject = labels.subject;
    const orderDate = (params.createdAt || new Date()).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    const totalPrice = `${params.totalPrice.toFixed(2)} ${currencyLabel}`;
    const lineCount = params.lineCount ?? params.itemCount;
    const itemRows = params.items && params.items.length > 0
      ? params.items.map((item) => `
        <tr>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;">${item.name}</td>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;text-align:center;">x${item.quantity}</td>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;text-align:right;">${(item.price * item.quantity).toFixed(2)} ${currencyLabel}</td>
        </tr>
      `).join('')
      : '';

    const text = [
      `${labels.hello} ${displayName},`,
      '',
      labels.intro,
      `${labels.items}: ${params.itemCount}`,
      `${labels.productLines}: ${lineCount}`,
      `${labels.total}: ${totalPrice}`,
      `${labels.courier}: ${params.courier || 'UPS'}`,
      params.trackingNumber ? `${labels.tracking}: ${params.trackingNumber}` : '',
      params.shippingAddress ? `${labels.shipping}: ${params.shippingAddress}` : '',
      `${labels.orderDate}: ${orderDate}`,
      '',
      labels.mockFooter,
    ].filter(Boolean).join('\n');

    const html = `
      <div style="margin:0;padding:20px;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;color:#1a202c;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 32px;text-align:center;border-radius:12px 12px 0 0;box-shadow:0 4px 12px rgba(102,126,234,0.15);">
              <div style="font-size:48px;margin-bottom:12px;">OK</div>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.3;">${labels.title}</h1>
              <p style="margin:8px 0 0 0;font-size:15px;color:rgba(255,255,255,0.9);">${labels.orderTitle} #${params.orderId}</p>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#2d3748;">
                ${labels.hello} <strong>${displayName}</strong>,<br/>
                ${labels.intro}
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">${labels.items}</td>
                  <td style="padding:12px 0;text-align:right;font-weight:600;color:#2d3748;">${params.itemCount}</td>
                </tr>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">${labels.productLines}</td>
                  <td style="padding:12px 0;text-align:right;font-weight:600;color:#2d3748;">${lineCount}</td>
                </tr>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">${labels.courier}</td>
                  <td style="padding:12px 0;text-align:right;font-weight:600;color:#2d3748;">${params.courier || 'UPS'}</td>
                </tr>
                ${params.trackingNumber ? `
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">${labels.tracking}</td>
                  <td style="padding:12px 0;text-align:right;font-weight:600;color:#667eea;font-family:monospace;">${params.trackingNumber}</td>
                </tr>
                ` : ''}
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">${labels.total}</td>
                  <td style="padding:12px 0;text-align:right;font-weight:800;font-size:18px;color:#667eea;">${totalPrice}</td>
                </tr>
              </table>

              ${params.shippingAddress ? `
              <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:14px;margin-bottom:24px;">
                <div style="font-size:12px;color:#6366f1;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">${labels.shipping}</div>
                <div style="font-size:14px;color:#3730a3;line-height:1.6;white-space:pre-wrap;">${params.shippingAddress}</div>
              </div>
              ` : ''}

              ${itemRows ? `
              <div style="margin-bottom:24px;">
                <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1a202c;">${labels.orderItems}</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                  <tr style="background:#f7fafc;">
                    <th align="left" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:0.5px;">${labels.product}</th>
                    <th align="center" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:0.5px;">${labels.quantity}</th>
                    <th align="right" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:0.5px;">${labels.subtotal}</th>
                  </tr>
                  ${itemRows}
                </table>
              </div>
              ` : ''}

              <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:6px;margin-bottom:24px;">
                <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#15803d;">${labels.whatNext}</h3>
                <ul style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:1.6;">
                  <li>${labels.next1}</li>
                  <li>${labels.next2}</li>
                  <li>${labels.next3}</li>
                </ul>
              </div>

              <p style="margin:0;font-size:12px;color:#718096;line-height:1.6;text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">
                ${labels.support}<br/>
                <em>${labels.mockFooter}</em>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px;text-align:center;font-size:12px;color:#718096;">
              <p style="margin:0;">(c) 2026 ShopHub. All rights reserved.</p>
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

  async sendDeliveryEmail(params: {
    orderId: number;
    recipientEmail: string;
    recipientName?: string | null;
    courier?: string | null;
    trackingNumber?: string | null;
    shippingAddress?: string | null;
    items?: Array<{ name: string; quantity: number; price?: number }>;
    deliveredAt?: Date;
  }): Promise<{ emailSent: boolean; reason?: string }> {
    const to = this.notifyOverrideTo || params.recipientEmail;
    if (!to) {
      return { emailSent: false, reason: 'No recipient email available' };
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      console.warn('SMTP not configured, skipping delivery email.');
      return { emailSent: false, reason: 'SMTP credentials are missing' };
    }

    const displayName = params.recipientName?.trim() || 'Customer';
    const subject = `Your order #${params.orderId} has been delivered`;
    const deliveredDate = (params.deliveredAt || new Date()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    const itemRows = params.items && params.items.length > 0
      ? params.items.map((item) => `
        <tr>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;">${item.name}</td>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;text-align:center;">x${item.quantity}</td>
          <td style="padding:10px 14px;border-top:1px solid #e7edf7;text-align:right;">${item.price ? ('$' + (item.price * item.quantity).toFixed(2)) : ''}</td>
        </tr>
      `).join('')
      : '';

    const html = `
      <div style="margin:0;padding:20px;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;color:#1a202c;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;">
          <tr>
            <td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 32px;text-align:center;border-radius:12px 12px 0 0;box-shadow:0 4px 12px rgba(16,185,129,0.15);">
              <div style="font-size:48px;margin-bottom:12px;">Package delivered</div>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.3;">Package Delivered</h1>
              <p style="margin:8px 0 0 0;font-size:15px;color:rgba(255,255,255,0.9);">Order #${params.orderId}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#2d3748;">
                Hi <strong>${displayName}</strong>,<br/>
                Good news - your package for order <strong>#${params.orderId}</strong> was delivered on <strong>${deliveredDate}</strong>.
              </p>

              ${params.trackingNumber ? `
              <div style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:16px;">
                <div style="font-size:12px;color:#718096;font-weight:600;text-transform:uppercase;margin-bottom:6px;">Tracking Number</div>
                <div style="font-size:14px;font-weight:700;color:#047857;font-family:monospace;">${params.trackingNumber}</div>
              </div>
              ` : ''}

              ${params.shippingAddress ? `
              <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:14px;margin-bottom:16px;">
                <div style="font-size:12px;color:#6366f1;font-weight:600;text-transform:uppercase;">Shipping Address</div>
                <div style="font-size:14px;color:#3730a3;white-space:pre-wrap;">${params.shippingAddress}</div>
              </div>
              ` : ''}

              ${itemRows ? `
              <div style="margin-bottom:24px;">
                <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1a202c;">Items Delivered</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                  <tr style="background:#f7fafc;">
                    <th align="left" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;">Product</th>
                    <th align="center" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;">Qty</th>
                    <th align="right" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;">Subtotal</th>
                  </tr>
                  ${itemRows}
                </table>
              </div>
              ` : ''}

              <p style="margin:0;font-size:12px;color:#718096;line-height:1.6;text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">
                If you did not receive your package or have any questions, please contact our support team.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;text-align:center;font-size:12px;color:#718096;">
              <p style="margin:0;">(c) 2026 ShopHub. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    const text = `Hi ${displayName},\n\nYour package for order #${params.orderId} was delivered on ${deliveredDate}.\n\nIf you have any questions, contact support.`;

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
