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
      <div style="margin:0;padding:20px;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;color:#1a202c;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 32px;text-align:center;border-radius:12px 12px 0 0;box-shadow:0 4px 12px rgba(102,126,234,0.15);">
              <div style="font-size:48px;margin-bottom:12px;">✓</div>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.3;">Payment Successful!</h1>
              <p style="margin:8px 0 0 0;font-size:15px;color:rgba(255,255,255,0.9);">Order #${params.orderId}</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#2d3748;">
                Hi <strong>${displayName}</strong>,<br/>
                Thank you for your order. We've successfully received your mock payment and your order is being prepared for shipment.
              </p>

              <!-- Order Summary Grid -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
                <div style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;">
                  <div style="font-size:12px;color:#718096;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Order ID</div>
                  <div style="font-size:18px;font-weight:700;color:#667eea;">#${params.orderId}</div>
                </div>
                <div style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;">
                  <div style="font-size:12px;color:#718096;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Order Date</div>
                  <div style="font-size:16px;font-weight:600;color:#2d3748;">${orderDate}</div>
                </div>
              </div>

              <!-- Order Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">Items</td>
                  <td style="padding:12px 0;text-align:right;font-weight:600;color:#2d3748;">${params.itemCount}</td>
                </tr>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">Product Lines</td>
                  <td style="padding:12px 0;text-align:right;font-weight:600;color:#2d3748;">${lineCount}</td>
                </tr>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">Courier Service</td>
                  <td style="padding:12px 0;text-align:right;font-weight:600;color:#2d3748;">${params.courier || 'UPS'}</td>
                </tr>
                ${params.trackingNumber ? `
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">Tracking Number</td>
                  <td style="padding:12px 0;text-align:right;font-weight:600;color:#667eea;font-family:monospace;">${params.trackingNumber}</td>
                </tr>
                ` : ''}
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:12px 0;color:#4a5568;font-size:14px;">Total Amount</td>
                  <td style="padding:12px 0;text-align:right;font-weight:800;font-size:18px;color:#667eea;">${totalPrice}</td>
                </tr>
              </table>

              ${params.shippingAddress ? `
              <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:14px;margin-bottom:24px;">
                <div style="font-size:12px;color:#6366f1;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">📍 Shipping Address</div>
                <div style="font-size:14px;color:#3730a3;line-height:1.6;white-space:pre-wrap;">${params.shippingAddress}</div>
              </div>
              ` : ''}

              <!-- Items Table -->
              ${itemRows ? `
              <div style="margin-bottom:24px;">
                <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1a202c;">Order Items</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                  <tr style="background:#f7fafc;">
                    <th align="left" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
                    <th align="center" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                    <th align="right" style="padding:12px 14px;font-size:12px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:0.5px;">Subtotal</th>
                  </tr>
                  ${itemRows}
                </table>
              </div>
              ` : ''}

              <!-- Next Steps -->
              <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:6px;margin-bottom:24px;">
                <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#15803d;">What Happens Next?</h3>
                <ul style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:1.6;">
                  <li>Your order is being prepared for shipment</li>
                  <li>You'll receive tracking updates via email</li>
                  <li>View your order status anytime in your account</li>
                </ul>
              </div>

              <p style="margin:0;font-size:12px;color:#718096;line-height:1.6;text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">
                If you have any questions, please contact our support team.<br/>
                <em>This is a mock payment confirmation from ShopHub.</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px;text-align:center;font-size:12px;color:#718096;">
              <p style="margin:0;">© 2026 ShopHub. All rights reserved.</p>
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
