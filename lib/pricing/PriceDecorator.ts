import { IPricing } from "./IPricing";

export abstract class PriceDecorator implements IPricing {
  constructor(protected wrapped: IPricing) {}

  abstract getTotal(): number;
  abstract getBreakdown(): string[];
}