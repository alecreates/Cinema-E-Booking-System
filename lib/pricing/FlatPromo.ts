import { PriceDecorator } from "./PriceDecorator";

export class FlatPromo extends PriceDecorator {
  constructor(
    wrapped: any,
    private amount: number,
    private code: string
  ) {
    super(wrapped);
  }

  getTotal(): number {
    return Math.max(0, this.wrapped.getTotal() - this.amount);
  }

  getBreakdown(): string[] {
    return [
      ...this.wrapped.getBreakdown(),
      `Promo (${this.code}): -$${this.amount.toFixed(2)}`,
    ];
  }
}