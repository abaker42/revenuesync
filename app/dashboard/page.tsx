//protected dashboard page with revenue chart
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard-client";

export default async function Dashboard() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/");
	}

	// Server-side fetch for revenue data (placeholder)
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/revenue`,
		{
			cache: "no-store",
		}
	);
	const { transactions, balance, payouts } = await response.json();
    console.log(transactions)
    console.log(balance)
    console.log(payouts)

	return (
		<DashboardClient
			transactions={transactions}
			balance={balance}
			payouts={payouts}
		/>
	);

}