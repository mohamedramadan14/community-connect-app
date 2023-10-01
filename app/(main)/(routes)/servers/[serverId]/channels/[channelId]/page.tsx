import { ChatHeader } from "@/components/chats/chat-header";
import { ChatInput } from "@/components/chats/chat-input";
import { ChatMessages } from "@/components/chats/chat-messages";
import { LiveRoom } from "@/components/live-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
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
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            type="channel"
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <LiveRoom chatId={channelId} video={false} audio={true} />
      )}

      {channel.type === ChannelType.VIDEO && (
        <LiveRoom chatId={channelId} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
