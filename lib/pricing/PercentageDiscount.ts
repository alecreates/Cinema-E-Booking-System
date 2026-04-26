import { PriceDecorator } from "./PriceDecorator";

export class PercentagePromo extends PriceDecorator {
  constructor(
    wrapped: any,
    private percent: number,
    private code: string
  ) {
    super(wrapped);
  }

  getTotal(): number {
    const base = this.wrapped.getTotal();
    return base - base * (this.percent / 100);
  }

  getBreakdown(): string[] {
    return [
      ...this.wrapped.getBreakdown(),
      `Promo (${this.code}): -${this.percent}%`,
    ];
  }
}