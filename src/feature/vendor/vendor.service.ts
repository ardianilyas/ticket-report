import { eq } from "drizzle-orm";
import { db } from "../../db";
import { vendors } from "../../db/schemas";
import { NotFoundError } from "../../errors/not-found";
import { VENDOR_NOT_FOUND } from "./vendor.type";
import type { CreateVendorDto, UpdateVendorDto } from "./vendor.dto";

export class VendorService {
  async getVendors() {
    return await db.select().from(vendors);
  }

  async getVendor(id: string) {
    const vendor = await db.select().from(vendors).where(eq(vendors.id, id));

    if (vendor.length === 0) {
      throw new NotFoundError(VENDOR_NOT_FOUND);
    }

    return vendor;
  }

  async createVendor(data: CreateVendorDto) {
    const [newVendor] = await db.insert(vendors).values(data).returning();

    return newVendor;
  }

  async updateVendor(id: string, data: UpdateVendorDto) {
    const [updatedVendor] = await db.update(vendors).set(data).where(eq(vendors.id, id)).returning();

    if (!updatedVendor) {
      throw new NotFoundError(VENDOR_NOT_FOUND);
    }

    return updatedVendor;
  }

  async deleteVendor(id: string) {
    const [deletedVendor] = await db.delete(vendors).where(eq(vendors.id, id)).returning();

    if (!deletedVendor) {
      throw new NotFoundError(VENDOR_NOT_FOUND);
    }

    return;
  }
}