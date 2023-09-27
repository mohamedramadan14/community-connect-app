"use client";

import { Search, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

type ServerSearchProps = {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
};
export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const KE = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", KE);
    return () => document.removeEventListener("keydown", KE);
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);
    if (type === "member")
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    if (type === "channel")
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
  };
  const content = data.map(({ label, type, data }) => {
    if (!data?.length) return null;
    return (
      <CommandGroup key={label} heading={label}>
        {data?.map(({ icon, name, id }) => (
          <CommandItem key={id} onSelect={() => onClick({ id, type })}>
            {icon}
            <span>{name}</span>
          </CommandItem>
        ))}
      </CommandGroup>
    );
  });
  return (
    <>
      <button
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        onClick={() => setOpen(!open)}
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for channel or member" />
        <CommandList>
          <CommandEmpty>No Results</CommandEmpty>
        </CommandList>
        {content}
      </CommandDialog>
    </>
  );
};
