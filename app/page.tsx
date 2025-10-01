// Public landing page
import Link from "next/link";
import Navbar from "@/components/navbar";

export default function Home() {
	return (
		<div className='min-h-screen bg-gray-900 text-white'>
			<Navbar />
			<section className='flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4'>
				<h1 className='text-4xl md:text-6xl font-bold mb-4'>
					RevenueSync: Unify Your Earnings
				</h1>
				<p className='text-lg md:text-xl mb-6 max-w-2xl'>
					Track Stripe, Gumroad, PayPal, and Lemon Squeezy revenue in one simple
					dashboard. No spreadsheets needed.
				</p>
				<Link
					href='/dashboard'
					className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
				>
					Get Started
				</Link>
			</section>
		</div>
	);
}