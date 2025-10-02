// route handler for stripe data
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

export async function GET(request: NextRequest) {
	try {
		// Get connected account from headers or session (for MVP, assume from localStorage via client, but simulate server-side)
		// In production: Fetch from DB using Clerk userId
		const stripeAccountId = request.headers.get("x-stripe-account"); // Or from auth middleware

		// Fetch charges (recent transactions) revenue from customers - use connected account if available
		const params: any = {
			limit: 10,
			created: { gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60 }, // Last 30 days
		};
		if (stripeAccountId) {
			params.stripeAccount = stripeAccountId;
		}
		const charges = await stripe.charges.list(params);
		const transactions = charges.data.map((charge) => ({
			date: new Date(charge.created * 1000).toISOString().split("T")[0],
			amount: charge.amount / 100,
			status: charge.status,
		}));

		// Fetch balance
        const balanceParams = stripeAccountId ? { stripeAccount: stripeAccountId } : {};
		const balance = await stripe.balance.retrieve(balanceParams);
		const availableBalance = balance.available.reduce((sum, b) => sum + b.amount / 100,0);
		const pendingBalance = balance.pending.reduce((sum, b) => sum + b.amount / 100,0);

		// Fetch payouts (Money transferred from stripe to bank account)
		const payoutParams = stripeAccountId ? { stripeAccount: stripeAccountId } : {};
		const payouts = await stripe.payouts.list({ limit: 10, ...payoutParams });
		const payoutData = payouts.data.map((payout) => ({
			date: new Date(payout.arrival_date * 1000).toISOString().split("T")[0],
			amount: payout.amount / 100,
			status: payout.status,
		}));

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