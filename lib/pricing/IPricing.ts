export interface IPricing {
  getTotal(): number;
  getBreakdown(): string[];
}