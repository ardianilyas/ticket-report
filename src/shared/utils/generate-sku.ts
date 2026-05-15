export function generateSku(lastNumber: number) {
  const nextNumber = lastNumber + 1;

  return `SKU-${String(nextNumber).padStart(5, "0")}`;
}
