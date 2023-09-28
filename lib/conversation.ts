import { db } from "@/lib/db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  const conversationFromOne = findConversation(memberOneId, memberTwoId);
  const conversationFromTwo = findConversation(memberTwoId, memberOneId);

  let [conversationOne, conversationTwo] = await Promise.all([
    conversationFromOne,
    conversationFromTwo,
  ]);

  if (conversationOne) {
    return conversationOne;
  } else if (conversationTwo) {
    return conversationTwo;
  } else {
    return await createNewConversation(memberOneId, memberTwoId);
  }
};
const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("FIND_CONVERSATION_DB", error);
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("CREATE_NEW_CONVERSATION_DB", error);
    return null;
  }
};
