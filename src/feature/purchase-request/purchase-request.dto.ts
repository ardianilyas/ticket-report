import z from "zod";

export const createPurchaseRequestItemDto = z.object({
  productId: z.uuid(),
  qty: z.number().positive(),
  notes: z.string().optional(),
});

export type CreatePurchaseItemDto = z.infer<typeof createPurchaseRequestItemDto>;

export const updatePurchaseRequestItemDto = z.object({
  productid: z.uuid().optional(),
  qty: z.number().positive().optional(),
  notes: z.string().optional().nullable(),
});

export type UpdatePurchaseItemDto = z.infer<typeof updatePurchaseRequestItemDto>;

export const createPurchaseRequestDto = z.object({
  notes: z.string().optional(),
  items: z.array(createPurchaseRequestItemDto).min(1, { error: "At least one item is required" }),
});

export type CreatePurchaseRequestDto = z.infer<typeof createPurchaseRequestDto>;

export const approvePurchaseRequestDto = z.object({
  notes: z.string().optional(),
});

export type ApprovePurchaseRequestDto = z.infer<typeof approvePurchaseRequestDto>;

export const rejectPurchaseRequestDto = z.object({
  reason: z.string().min(1, { error: "Reason is required" }),
});

export type RejectPurchaseRequestDto = z.infer<typeof rejectPurchaseRequestDto>;
