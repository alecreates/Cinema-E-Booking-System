"use client";

import emailjs from "@emailjs/browser";
import { applyPromotions } from "@/lib/pricing/applyPromotions";

export type TicketType = "adult" | "child" | "senior";

export type SavedCard = {
  _id: string;
  billingAddress: string;
  expirationDate: string;
  cardNumberMasked: string;
};

type CheckoutUser = {
  id?: string;
  name?: string;
};

type CheckoutTicket = {
  type: TicketType;
  count: number;
};

export type ProcessCheckoutInput = {
  currentUser: CheckoutUser | null;
  movieId: string | null;
  movieTitle: string;
  showDate: string;
  showTime: string;
  hall: string;
  email: string;
  subtotal: string;
  showId: string | null;
  seatIds: string[];
  selectedSeats: string[];
  selectedCardId: string;
  selectedCard: SavedCard | null;
  lockExpiresAt: number;
  tickets: CheckoutTicket[];
  promoCode?: string; // ✅ user-entered promo
};
export type NewCardInput = {
  userId: string;
  cardholderName: string;
  cardNumber: string;
  expirationDate: string;
  billingAddress: string;
};

type CreatedBooking = {
  _id: string;
};

const PRICE_MAP: Record<TicketType, number> = {
  adult: 12.99,
  child: 8.99,
  senior: 9.99,
};

const getCurrentTimestamp = () => new Date().getTime();

export class PaymentFacade {
  async getSavedPaymentMethods(userId: string): Promise<SavedCard[]> {
    const response = await fetch(`/api/paymentcards?userId=${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to load payment methods.");
    }

    return data;
  }
  async saveNewCard(input: NewCardInput): Promise <SavedCard> {
    const response = await fetch("/api/paymentcards", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: input.userId,
        cardholderName: input.cardholderName,
        cardNumber: input.cardNumber,
        expirationDate: input.expirationDate,
        billingAddress: input.billingAddress
      })
    })
    const data = await response.json();
    if (!response.ok){
      throw new Error(data.error || "Failed to save payment card.");
    }
    return {
      ...data,
      cardNumberMasked: `**** **** **** ${input.cardNumber.replace(/\s/g, "").slice(-4)}`,
    }

  }

  async processCheckout(input: ProcessCheckoutInput) {
    this.validateSeatLock(input.lockExpiresAt);
    this.validatePaymentMethod(input.selectedCardId);

    // 1. Convert subtotal
    const subtotalNumber = parseFloat(input.subtotal);

    // 2. Fetch promotions (filtered by promoCode)
    //const promotions = await this.fetchPromotions(input.promoCode);

    // 3. Apply decorator pattern
    const finalTotal = await applyPromotions(subtotalNumber, input.promoCode);

    //  4. Create booking with FINAL total
    const booking = await this.createBooking(input, finalTotal);

    await this.createTickets(booking._id, input);
    await this.recordPurchaseInteraction(input);
    await this.sendConfirmationEmail(input, finalTotal);

    this.clearSeatLocks(input.showId, input.seatIds);

    return { emailSent: true, bookingId: booking._id };
  }

  // FETCH PROMOS USING PROMO CODE
  private async fetchPromotions(promoCode?: string) {
    if (!promoCode) return [];

    try {
      const res = await fetch(`/api/promotions?code=${promoCode}`);
      const data = await res.json();

      if (!res.ok) return [];

      // expected: [{ type: "percent" | "flat", value: number }]
      return data.data || [];
    } catch (err) {
      console.error("Failed to fetch promotions:", err);
      return [];
    }
  }

  private validateSeatLock(lockExpiresAt: number) {
    if (lockExpiresAt && lockExpiresAt <= getCurrentTimestamp()) {
      throw new Error(
        "Your seat reservation expired. Please go back and select seats again."
      );
    }
  }

  private validatePaymentMethod(selectedCardId: string) {
    if (!selectedCardId) {
      throw new Error("Please select a saved payment method to continue.");
    }
  }

  private async createBooking(
    input: ProcessCheckoutInput,
    total: number
  ): Promise<CreatedBooking> {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: input.currentUser?.id,
        promotionCode: input.promoCode || null, // ✅ store code
        paymentCardId: input.selectedCardId,
        showId: input.showId,
        total: total,
        bookingDate: new Date(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create booking.");
    }

    return data;
  }

  private async createTickets(bookingId: string, input: ProcessCheckoutInput) {
    const ticketTypes = input.tickets.flatMap(({ type, count }) =>
      Array(count).fill(type.toUpperCase())
    );

    for (let i = 0; i < input.seatIds.length; i += 1) {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          seatId: input.seatIds[i],
          showId: input.showId,
          type: ticketTypes[i],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create ticket.");
      }
    }
  }

  private async recordPurchaseInteraction(input: ProcessCheckoutInput) {
    if (!input.currentUser?.id || !input.movieId) return;

    const response = await fetch("/api/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: input.currentUser.id,
        movieId: input.movieId,
        action: "purchase",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to record purchase interaction.");
    }
  }

  private async sendConfirmationEmail(
    input: ProcessCheckoutInput,
    finalTotal: number
  ) {
    const ticketBreakdown = input.tickets
      .map(
        ({ type, count }) =>
          `${this.formatTicketLabel(type)}: ${count} x $${PRICE_MAP[type].toFixed(2)}`
      )
      .join("\n");

    const orderMessage = [
      `Movie: ${input.movieTitle}`,
      `Showtime: ${input.showDate} at ${input.showTime}`,
      `Auditorium: ${input.hall}`,
      `Seats: ${input.selectedSeats.join(", ")}`,
      `Tickets:\n${ticketBreakdown}`,
      `Subtotal: $${input.subtotal}`,
      input.promoCode ? `Promo Code: ${input.promoCode}` : "",
      `Total after promotions: $${finalTotal.toFixed(2)}`,
      input.selectedCard
        ? `Payment Method: ${input.selectedCard.cardNumberMasked}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    await emailjs.send("service_nbvsrvg", "template_2tb6c16", {
      name: input.currentUser?.name || "Guest",
      email: input.email,
      message: orderMessage,
    });
  }

  private clearSeatLocks(showId: string | null, seatIds: string[]) {
    if (!showId || typeof window === "undefined") return;

    const seatLockSessionId = sessionStorage.getItem("seatLockSessionId");
    if (!seatLockSessionId) return;

    const lockKey = `seatLocks:${showId}`;
    const selectedSeatIds = new Set(seatIds);

    try {
      const activeLocks = JSON.parse(
        localStorage.getItem(lockKey) || "[]"
      ).filter(
        (lock: { seatId: string; sessionId: string; expiresAt: number }) =>
          lock.expiresAt > getCurrentTimestamp() &&
          !(
            lock.sessionId === seatLockSessionId &&
            selectedSeatIds.has(lock.seatId)
          )
      );

      localStorage.setItem(lockKey, JSON.stringify(activeLocks));
    } catch {
      localStorage.removeItem(lockKey);
    }
  }

  private formatTicketLabel(type: TicketType) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

export const paymentFacade = new PaymentFacade();