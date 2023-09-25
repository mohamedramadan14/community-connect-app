import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profile) return profile;

    const newProfileData = {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    };
    if (
      !newProfileData.userId ||
      !newProfileData.name ||
      !newProfileData.imageUrl ||
      !newProfileData.email
    ) {
      throw new Error("Missing required properties in user object");
    }

    const newProfile = await db.profile.create({
      data: newProfileData,
    });

    return newProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
