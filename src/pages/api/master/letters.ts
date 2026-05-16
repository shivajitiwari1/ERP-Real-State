import { LetterTemplate } from "@/models";
import { simpleCrudHandler } from "@/lib/simple-crud";
import { z } from "zod";
export default simpleCrudHandler(LetterTemplate, z.object({ name: z.string().min(1, "Name required"), content: z.string().min(1, "Content required"), headFormat: z.string().optional() }));
