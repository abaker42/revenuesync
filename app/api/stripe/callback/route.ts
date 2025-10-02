import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
	try {
		const { code, userId } = await request.json();

		// Exchange code for tokens
		const tokenResponse = await fetch(
			"https://connect.stripe.com/oauth/token",
			{
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					grant_type: "authorization_code",
					client_id: process.env.STRIPE_CLIENT_ID!,
					code,
					// For production, add client_secret from your Stripe Dashboard
				}),
			}
		);

		const tokens = await tokenResponse.json();
		if (tokens.error) {
			throw new Error(tokens.error_description);
		}

		const { stripe_user_id, access_token } = tokens;
		// Store access_token and stripe_user_id securely (e.g., in DB with userId)
		// For MVP: Return for localStorage
		return NextResponse.json({ stripe_user_id, access_token });
	} catch (error) {
		return NextResponse.json(
			{ error: "OAuth exchange failed" },
			{ status: 400 }
		);
	}
}
