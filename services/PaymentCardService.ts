// services/PaymentCardService.ts

import { dbConnect } from "@/lib/mongodb";
import PaymentCard from "@/models/PaymentCard";
import { encrypt, decrypt } from "@/lib/encryption";

/**
 * Creates a new payment card.
 *
 * Validates required fields, enforces the maximum
 * number of cards per customer, encrypts the card
 * number, and stores the card.
 *
 * @param data - The payment card data.
 * @param data.customerId - The customer identifier.
 * @param data.cardNumber - The card number.
 * @param data.billingAddress - The billing address.
 * @param data.expirationDate - The expiration date.
 * @returns A promise that resolves to the created card.
 * @throws Error if validation fails.
 */
export async function createPaymentCard(data: {
    customerId: string;
    cardNumber: string;
    billingAddress: string;
    expirationDate: string;
}) {
    await dbConnect();

    const {
        customerId,
        cardNumber,
        billingAddress,
        expirationDate,
    } = data;

    if (
        !customerId ||
        !cardNumber ||
        !billingAddress ||
        !expirationDate
    ) {
        throw new Error("Missing required fields");
    }

    const cardCount = await PaymentCard.countDocuments({
        customerId,
    });

    if (cardCount >= 3) {
        throw new Error("Maximum of 3 payment cards allowed");
    }

    const encryptedCardNumber = encrypt(cardNumber);

    return await PaymentCard.create({
        customerId,
        cardNumber: encryptedCardNumber,
        billingAddress,
        expirationDate,
    });
}

/**
 * Retrieves payment cards for a user.
 *
 * Decrypts stored card numbers and returns both
 * full and masked values.
 *
 * @param userId - The customer identifier.
 * @returns A promise that resolves to payment cards.
 * @throws Error if userId is missing.
 */
export async function getPaymentCardsByUserId(
    userId: string
) {
    await dbConnect();

    if (!userId) {
        throw new Error("Missing userId");
    }

    const cards = await PaymentCard.find({
        customerId: userId,
    });

    return cards.map((card) => {
        const decrypted = decrypt(card.cardNumber);

        return {
            ...card.toObject(),
            cardNumber: decrypted,
            cardNumberMasked: `**** **** **** ${decrypted.slice(-4)}`,
        };
    });
}

/**
 * Deletes a payment card by identifier.
 *
 * Removes the matching payment card record.
 *
 * @param id - The payment card identifier.
 * @returns A promise that resolves to the deleted card or null.
 */
export async function deletePaymentCard(id: string) {
    await dbConnect();

    return await PaymentCard.findByIdAndDelete(id);
}

/**
 * Updates a payment card by identifier.
 *
 * Encrypts the card number if provided, applies updates,
 * and returns the updated record.
 *
 * @param id - The payment card identifier.
 * @param data - Fields to update.
 * @returns A promise that resolves to the updated card or null.
 */
export async function updatePaymentCard(
    id: string,
    data: any
) {
    await dbConnect();

    if (data.cardNumber) {
        data.cardNumber = encrypt(data.cardNumber);
    }

    return await PaymentCard.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
}