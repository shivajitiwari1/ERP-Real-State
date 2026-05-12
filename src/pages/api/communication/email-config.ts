import { EmailConfig } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(EmailConfig as any, z.object({
  smtpHost: z.string().min(1, 'SMTP host required'),
  smtpPort: z.number().default(587),
  username: z.string().min(1, 'Username required'),
  passwordEncrypted: z.string().optional(),
  fromEmail: z.string().email('Valid email required'),
  isSsl: z.boolean().default(true),
}));
