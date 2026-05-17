import { desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { products, purchaseRequestItems, purchaseRequests } from "../../db/schemas";
import type { CreatePurchaseRequestDto } from "./purchase-request.dto";
import { NotFoundError } from "../../errors/not-found";

export class PurchaseRequestService {
  async create(data: CreatePurchaseRequestDto, userId: string) {
    await this.validateProducts(data.items.map((item) => item.productId));

    const prNumber = await this.generatePrNumber();

    const createdPurchaseRequest = await db.transaction(async(tx) => {
      const [purchaseRequest] = await tx.insert(purchaseRequests).values({
        prNumber,
        requestedBy: userId,
        status: "pending",
        notes: data.notes
      }).returning();

      if(!purchaseRequest) throw new Error("Failed to create purchase request");

      await tx.insert(purchaseRequestItems).values(data.items.map((item) => ({
          purchaseRequestId: purchaseRequest.id,
          productId: item.productId,
          qty: item.qty,
          notes: item.notes
        }))
      );

      return purchaseRequest;
    });

    const purchaseRequest = await db.query.purchaseRequests.findFirst({
      where: eq(purchaseRequests.id, createdPurchaseRequest.id),
      with: {
        items: {
          with: {
            product: true
          }
        },
        requester: true,
        approver: true,
      }
    });

    if (!purchaseRequest) {
      throw new NotFoundError("Purchase request not found");
    }

    return {
      id: purchaseRequest.id,
      prNumber: purchaseRequest.prNumber,
      requestedBy: purchaseRequest.requester.name,
      approvedBy: purchaseRequest.approver?.name,
      status: purchaseRequest.status,
      notes: purchaseRequest.notes,
      requestDate: purchaseRequest.requestDate,
      approvedAt: purchaseRequest.approvedAt,
      createdAt: purchaseRequest.createdAt,
      updatedAt: purchaseRequest.updatedAt,
      items: purchaseRequest.items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        qty: item.qty,
        notes: item.notes
      }))
    };
  }

  private async validateProducts(productIds: string[]) {
    const existingProducts = await db.select({ id: products.id }).from(products).where(inArray(products.id, productIds));

    if (existingProducts.length !== productIds.length) {
      throw new NotFoundError("Some of the products do not exist");
    }
  }

  private async generatePrNumber() {
    const [lastPurchaseRequest] = await db.select().from(purchaseRequests).orderBy(desc(purchaseRequests.createdAt)).limit(1);

    const lastNumber = lastPurchaseRequest ? Number(lastPurchaseRequest.prNumber.split("-")[1]) : 0;

    const nextNumber = lastNumber + 1;

    return `PR-${String(nextNumber).padStart(5, "0")}`;
  }
}