// route handler for stripe data
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

export async function GET() {
	try {
		// Fetch charges (recent transactions) money received from customers
		const charges = await stripe.charges.list({
			limit: 10,
			created: { gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60 }, // Last 30 days
		});
		const transactions = charges.data.map((charge) => ({
			date: new Date(charge.created * 1000).toISOString().split("T")[0],
			amount: charge.amount / 100,
			status: charge.status,
		}));

		// Fetch balance
		const balance = await stripe.balance.retrieve();
		const availableBalance = balance.available.reduce(
			(sum, b) => sum + b.amount / 100,
			0
		);
		const pendingBalance = balance.pending.reduce(
			(sum, b) => sum + b.amount / 100,
			0
		);

		// Fetch payouts (Money transferred from stripe to bank account)
		const payouts = await stripe.payouts.list({ limit: 10 });
		const payoutData = payouts.data.map((payout) => ({
			date: new Date(payout.arrival_date * 1000).toISOString().split("T")[0],
			amount: payout.amount / 100,
			status: payout.status,
		}));

        //
		return NextResponse.json({
			transactions,
			balance: { available: availableBalance, pending: pendingBalance },
			payouts: payoutData,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch revenue data" },
			{ status: 500 }
		);
	}
}