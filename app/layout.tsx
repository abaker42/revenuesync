// Root layout need to add Clerk auth provider
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
	title: "RevenueSync",
	description:
		"Unify your Stripe, Gumroad, PayPal, and Lemon Squeezy revenue in one dashboard.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body>{children}</body>
			</html>
		</ClerkProvider>
	);
}
