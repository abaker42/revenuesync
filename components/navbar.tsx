import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className='flex justify-between items-center p-4 bg-gray-800'>
			<Link href='/' className='text-2xl font-bold'>
				RevenueSync
			</Link>
			<div>
				<SignedIn>
					<UserButton />
				</SignedIn>
				<SignedOut>
					<SignInButton mode='modal'>
						<button className='bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded'>
							Sign In
						</button>
					</SignInButton>
				</SignedOut>
			</div>
		</nav>
	);
}
