import { SmsConfig } from "@/models";
import { simpleCrudHandler } from "@/lib/simple-crud";
import { z } from "zod";
export default simpleCrudHandler(SmsConfig as any, z.object({ apiUrl: z.string().url("Valid URL required"), apiKey: z.string().min(1), senderId: z.string().min(1) }));
