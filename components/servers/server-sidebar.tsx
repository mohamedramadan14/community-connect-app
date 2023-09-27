import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "@/components/servers/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/servers/server-search";
import { Crown, Hash, Mic, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "@/components/servers/server-section";
import { ServerChannel } from "@/components/servers/server-channel";
import { ServerMember } from "@/components/servers/server-member";

type ServerSideBarProps = {
  serverId: string;
};

const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <Crown className="h-4 w-4 mr-2 text-amber-400" />,
};

export const ServerSideBar = async ({ serverId }: ServerSideBarProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const textChannels = server?.channels?.filter((channel) => {
    return channel.type === ChannelType.TEXT;
  });

  const audioChannels = server?.channels?.filter((channel) => {
    return channel.type === ChannelType.AUDIO;
  });

  const videoChannels = server?.channels?.filter((channel) => {
    return channel.type === ChannelType.VIDEO;
  });

  const members = server?.members.filter((member) => {
    return member.profileId !== profile.id;
  });

  const role = server?.members?.find(
    (member) => member.profileId === profile.id
  )?.role;

  const textChannelContent = !!textChannels.length && (
    <div className="mb-2">
      <ServerSection
        sectionType="channels"
        channelType={ChannelType.TEXT}
        role={role}
        label="Text Channels"
      />
      <div className="space-y-[2px]">
        {textChannels.map((channel) => {
          return (
            <ServerChannel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />
          );
        })}
      </div>
    </div>
  );

  const audioChannelContent = !!audioChannels.length && (
    <div className="mb-2">
      <ServerSection
        sectionType="channels"
        channelType={ChannelType.AUDIO}
        role={role}
        label="Voice Channels"
      />
      <div className="space-y-[2px]">
        {audioChannels.map((channel) => {
          return (
            <ServerChannel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />
          );
        })}
      </div>
    </div>
  );

  const videoChannelContent = !!videoChannels.length && (
    <div className="mb-2">
      <ServerSection
        sectionType="channels"
        channelType={ChannelType.VIDEO}
        role={role}
        label="Video Channels"
      />
      <div className="space-y-[2px]">
        {videoChannels.map((channel) => {
          return (
            <ServerChannel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />
          );
        })}
      </div>
    </div>
  );

  const memberChannelContent = !!members.length && (
    <div className="mb-2">
      <ServerSection
        sectionType="members"
        role={role}
        label="Members"
        server={server}
      />
      {members.map((member) => {
        return <ServerMember key={member.id} member={member} server={server} />;
      })}
    </div>
  );
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-300 dark:bg-zinc-700 rounded-md my-2" />
        {textChannelContent}
        {audioChannelContent}
        {videoChannelContent}
        {memberChannelContent}
      </ScrollArea>
    </div>
  );
};
