// src/pages/api/communication/send-sms.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SmsConfig, SmsLog } from '@/models';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const config = await SmsConfig.findOne();
    if (!config) return badRequest(res, 'SMS gateway not configured. Go to SMS Setup first.');

    const { mobile, message } = req.body;
    if (!mobile || !message) return badRequest(res, 'Mobile number and message are required');

    let status: 'sent' | 'failed' = 'sent';
    let error: string | undefined;

    try {
      const url = new URL(config.apiUrl);
      url.searchParams.set('apikey', config.apiKey);
      url.searchParams.set('sender', config.senderId);
      url.searchParams.set('numbers', mobile.replace(/\D/g, ''));
      url.searchParams.set('message', message);

      const response = await fetch(url.toString());
      if (!response.ok) {
        status = 'failed';
        error = `Gateway returned ${response.status}`;
      }
    } catch (sendErr: any) {
      status = 'failed';
      error = sendErr?.message ?? 'Network error';
    }

    await SmsLog.create({
      mobile,
      message,
      status,
      sentAt: new Date(),
    });

    if (status === 'failed') return res.status(500).json({ success: false, message: `SMS failed: ${error}` });
    return ok(res, null, 'SMS sent successfully');
  } catch (err) {
    return serverError(res, err);
  }
}
