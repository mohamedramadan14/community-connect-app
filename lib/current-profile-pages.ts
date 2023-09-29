import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

/**
 * Retrieves the profile of the currently authenticated user.
 * @returns The profile of the currently authenticated user or null if not authenticated.
 */

export const currentProfilePages = async (req: NextApiRequest) => {
  try {
    const { userId } = await getAuth(req);

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
