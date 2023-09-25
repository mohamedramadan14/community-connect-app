import { ServerSideBar } from "@/components/servers/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type ServerIdLayoutProps = {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
};
const ServerIdLayout = async ({ children, params }: ServerIdLayoutProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const serverId = params.serverId;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSideBar serverId={serverId} />
      </div>

      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
