// this component has to be a client component because it uses Clerk's useUser hook
"use client";

import { useUser } from "@clerk/nextjs";
import ConnectButton from "@/components/connect-stripe";
import RevenueChart from "@/components/revenue-chart";
import Link from "next/link";

interface DashboardClientProps {
	transactions: { date: string; amount: number; status: string }[];
	balance: { available: number; pending: number };
	payouts: { date: string; amount: number; status: string }[];
}

export default function DashboardClient({transactions, balance, payouts}: DashboardClientProps) {
	const { isSignedIn, user } = useUser();

	if (!isSignedIn) {
		return <div>Loading...</div>;
	}

	return (
		<div className='min-h-screen bg-gray-900 text-white p-4'>
			<h1 className='text-2xl font-bold mb-4'>Welcome, {user?.firstName}</h1>
			<ConnectButton />
            <Link href='/' className='text-blue-400 underline mt-4 inline-block'>Home</Link>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
				<div>
					<h2 className='text-xl font-semibold mb-2'>Balance</h2>
					<p>Available: ${balance.available.toFixed(2)}</p>
					<p>Pending: ${balance.pending.toFixed(2)}</p>
				</div>
				<div>
					<h2 className='text-xl font-semibold mb-2'>Recent Payouts</h2>
					<ul>
						{payouts.map((payout, index) => (
							<li key={index} className='mb-2'>
								{payout.date}: ${payout.amount.toFixed(2)} ({payout.status})
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className='mt-4'>
				<h2 className='text-xl font-semibold mb-2'>Revenue Trend</h2>
				<RevenueChart transactions={transactions} />
			</div>
		</div>
	);
}
