import { IPricing } from "./IPricing";

export class BasePrice implements IPricing {
  constructor(private subtotal: number) {}

  getTotal(): number {
    return this.subtotal;
  }

  getBreakdown(): string[] {
    return [`Subtotal: $${this.subtotal.toFixed(2)}`];
  }
}