"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";

type ServerSectionProps = {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
};
export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="create channel" align="center" side="top">
          <button
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("createChannel", { channelType })}
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage members" align="center" side="top">
          <button
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("manageMembers", { server })}
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
