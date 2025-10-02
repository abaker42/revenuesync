import { clerkClient } from "@clerk/nextjs/server";

export async function updateClerkUserMetadata(
	userId: string,
	metadata: { stripeAccountId: string }
) {
	try {
        (await clerkClient()).users.updateUserMetadata(userId, {publicMetadata: metadata})
	} catch (error) {
		console.error("Failed to update Clerk metadata:", error);
		throw new Error("Metadata update failed");
	}
}
