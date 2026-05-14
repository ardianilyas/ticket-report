import z from "zod";
import { VENDOR_VALIDATION_MESSAGE } from "./vendor.type";

export const createVendorDto = z.object({
  name: z.string().min(1, { error: VENDOR_VALIDATION_MESSAGE.name.min }),
  email: z.string().min(1, { error: VENDOR_VALIDATION_MESSAGE.email.min }),
  phone: z.string().min(1, { error: VENDOR_VALIDATION_MESSAGE.phone.min }),
  address: z.string().min(1, { error: VENDOR_VALIDATION_MESSAGE.address.min }),
});

export const updateVendorDto = createVendorDto.partial();

export const getVendorIdDto = z.uuid({ error: VENDOR_VALIDATION_MESSAGE.id.uuid });

export type CreateVendorDto = z.infer<typeof createVendorDto>;
export type UpdateVendorDto = Partial<CreateVendorDto>;
