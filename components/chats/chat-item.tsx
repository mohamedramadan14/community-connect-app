"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import Image from "next/image";
import { Crown, FileIcon, ShieldCheck } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import ActionTooltip from "@/components/action-tooltip";

type ChatItemProps = {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl?: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <Crown className="w-4 h-4 ml-2 text-amber-500" />,
};
export const ChatItem = ({
  content,
  currentMember,
  deleted,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
  fileUrl,
}: ChatItemProps) => {
  const fileType = fileUrl?.split(".").pop();
  const fileName = fileUrl?.split(".")[0];

  const isAdmin = member.role === MemberRole.ADMIN;
  const isModerator = member.role === MemberRole.MODERATOR;
  const isOwner = member.id === currentMember.id;
  const canDeleteMessage = !deleted && (isOwner || isModerator || isAdmin);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileUrl && fileType === "pdf";
  const isImage = !isPdf && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex  gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} className="h-5 w-5" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip
                label={member.role === MemberRole.GUEST ? "User" : member.role}
              >
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary w-48 h-48"
            >
              <Image
                fill
                src={fileUrl}
                alt={content}
                className="object-cover"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 ">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                {fileName}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
