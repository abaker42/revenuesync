"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function ConnectStripe() {
	const { user } = useUser();
	const [connected, setConnected] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// Check if already connected (e.g., from localStorage or Clerk metadata)
		const stripeAccountId = localStorage.getItem(`stripe_account_${user?.id}`);
		setConnected(!!stripeAccountId);
	}, [user]);

	const handleConnect = async () => {
		setLoading(true);
		setError("");
		try {
			// Redirect to Stripe OAuth
			const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&state=${user?.id}&redirect_uri=https://localhost:3000/dashboard`; // Adjust redirect_uri as needed
			window.location.href = stripeAuthUrl;
		} catch (err) {
			setError("Failed to initiate connection");
		}
		setLoading(false);
	};

	// Handle OAuth callback (call this from a new /api/stripe/callback route, but for MVP, simulate post-redirect)
	const handleCallback = async (code: string) => {
		try {
			const response = await fetch("/api/stripe/callback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code, userId: user?.id }),
			});
			if (response.ok) {
				const { stripe_user_id } = await response.json();
				localStorage.setItem(`stripe_account_${user?.id}`, stripe_user_id);
				setConnected(true);
			} else {
				setError("Connection failed");
			}
		} catch (err) {
			setError("Callback error");
		}
	};

	// For demo: Simulate callback if code in URL (after redirect)
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		if (code) {
			handleCallback(code);
			// Clear URL params
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, []);

	return (
		<div>
			<button
				onClick={handleConnect}
				disabled={loading || connected}
				className={`py-2 px-4 rounded text-white ${
					connected ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
				}`}
			>
				{loading
					? "Connecting..."
					: connected
					? "Stripe Connected"
					: "Connect Stripe"}
			</button>
			{error && <p className='text-red-500 mt-2'>{error}</p>}
		</div>
	);
}
