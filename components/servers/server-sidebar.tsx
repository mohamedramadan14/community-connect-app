import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "@/components/servers/server-header";

type ServerSideBarProps = {
  serverId: string;
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

  const videChannels = server?.channels?.filter((channel) => {
    return channel.type === ChannelType.VIDEO;
  });

  const members = server?.members.filter((member) => {
    return member.profileId !== profile.id;
  });

  const role = server?.members?.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};
