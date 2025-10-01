"use client";

import { useState } from "react";

export default function ConnectStripe() {
	const [connected, setConnected] = useState(false);

	const handleConnect = async () => {
		// Placeholder: Connect to Stripe via OAuth
		setConnected(true);
		// TODO: Implement Stripe OAuth redirect
	};

	return (
		<button
			onClick={handleConnect}
			className={`py-2 px-4 rounded ${
				connected ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
			} text-white`}
		>
			{connected ? "Stripe Connected" : "Connect Stripe"}
		</button>
	);
}
