import { ChatHeader } from "@/components/chats/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};
const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const channelId = params.channelId;
  if (!channelId) return null;

  const channelPromise = db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const memberPromise = db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  const [channel, member] = await Promise.all([channelPromise, memberPromise]);

  if (!channel || !member) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={params.serverId}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
