abstract class PriceComponent {
  abstract getTotal(): number;
}

class BasePrice extends PriceComponent {
  constructor(private price: number) {
    super();
  }

  getTotal() {
    return this.price;
  }
}

abstract class PromoDecorator extends PriceComponent {
  constructor(protected component: PriceComponent) {
    super();
  }
}

export class PercentagePromo extends PromoDecorator {
  constructor(component: PriceComponent, private percent: number) {
    super(component);
  }

  getTotal() {
    return this.component.getTotal() * (1 - this.percent / 100);
  }
}

export class FlatPromo extends PromoDecorator {
  constructor(component: PriceComponent, private amount: number) {
    super(component);
  }

  getTotal() {
    return this.component.getTotal() - this.amount;
  }
}

export function applyPromotions(basePrice: number, promos: any[]) {
  let price: PriceComponent = new BasePrice(basePrice);

  for (const promo of promos) {
    if (promo.type === "percentage") {
      price = new PercentagePromo(price, promo.value);
    } else if (promo.type === "flat") {
      price = new FlatPromo(price, promo.value);
    }
  }

  return Math.max(0, price.getTotal());
}