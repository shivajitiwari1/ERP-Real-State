// src/pages/api/communication/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { EmailConfig, EmailLog } from '@/models';
import nodemailer from 'nodemailer';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const config = await EmailConfig.findOne();
    if (!config) return badRequest(res, 'SMTP not configured. Go to Email Setup first.');

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.isSsl,
      auth: { user: config.username, pass: config.passwordEncrypted },
    });

    const { to, subject, body } = req.body;
    if (!to || !subject) return badRequest(res, 'Recipient and subject are required');

    let status: 'sent' | 'failed' = 'sent';
    let error: string | undefined;

    try {
      await transporter.sendMail({
        from: config.fromEmail,
        to,
        subject,
        html: body || subject,
      });
    } catch (sendErr: any) {
      status = 'failed';
      error = sendErr?.message ?? 'Unknown error';
    }

    await EmailLog.create({
      toEmail: to,
      subject,
      body: body || '',
      status,
      error,
      sentAt: new Date(),
    });

    if (status === 'failed') return res.status(500).json({ success: false, message: `Email failed: ${error}` });
    return ok(res, null, 'Email sent successfully');
  } catch (err) {
    return serverError(res, err);
  }
}
