"use client";

import { Plus } from "lucide-react";
import ActionTooltip from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-model-store";

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip label="add server" align="center" side="right">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="flex mx-3 rounded-[24px] group-hover:rounded-[16px] h-[48px] w-[48px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              size={25}
              className="text-emerald-500 transition group-hover:text-white"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
