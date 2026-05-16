import { HoldingCharge } from "@/models";
import { simpleCrudHandler } from "@/lib/simple-crud";
import { z } from "zod";
export default simpleCrudHandler(HoldingCharge, z.object({ projectId: z.number().int().positive(), chargePerDay: z.number().min(0), effectiveFrom: z.string().min(1) }));
