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

class PercentagePromo extends PromoDecorator {
  constructor(component: PriceComponent, private percent: number) {
    super(component);
  }

  getTotal() {
    return this.component.getTotal() * (1 - this.percent / 100);
  }
}

class FlatPromo extends PromoDecorator {
  constructor(component: PriceComponent, private amount: number) {
    super(component);
  }

  getTotal() {
    return this.component.getTotal() - this.amount;
  }
}

async function getPromoFromAPI(code: string) {
  if (!code) return null;

  const res = await fetch(`/api/promotions/${code}`);

  if (!res.ok) return null;

  return res.json();
}

export async function applyPromotions(basePrice: number, promoCode: string) {
  let price: PriceComponent = new BasePrice(basePrice);

  const promo = await getPromoFromAPI(promoCode);

  // ✅ REQUIRED FIX: prevent silent invalid promo objects
  if (!promo || typeof promo.type !== "string" || typeof promo.value !== "number") {
    return price.getTotal();
  }

  if (promo.type === "percentage") {
    price = new PercentagePromo(price, promo.value);
  }

  if (promo.type === "flat") {
    price = new FlatPromo(price, promo.value);
  }

  return Math.max(0, price.getTotal());
}