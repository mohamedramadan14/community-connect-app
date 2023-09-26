import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type ParamsType = {
  params: {
    serverId: string;
  };
};
export async function PATCH(req: Request, { params }: ParamsType) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("unauthorized", { status: 401 });

    const { name, imageUrl } = await req.json();

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: ParamsType) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("unauthorized", { status: 401 });

    const serverId = params.serverId;
    if (!serverId)
      return new NextResponse("Server ID is missing", { status: 400 });

    const server = await db.server.delete({
      where: { id: serverId, profileId: profile.id },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
