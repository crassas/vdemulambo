export type ShippingMethod = 'ctt' | 'mao';

export const SHIPPING_COST_CTT = 4.50;

export function calculateFinalPrice(basePrice: number, method: ShippingMethod): number {
  if (method === 'ctt') {
    return basePrice + SHIPPING_COST_CTT;
  }
  return basePrice;
}
