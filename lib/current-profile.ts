import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

/**
 * Retrieves the profile of the currently authenticated user.
 * @returns The profile of the currently authenticated user or null if not authenticated.
 */

export const currentProfile = async () => {
  try {
    const { userId } = await auth();

    if (!userId) return null;

    const profile = await db.profile.findUnique({
      where: {
        userId,
      },
    });

    return profile;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
