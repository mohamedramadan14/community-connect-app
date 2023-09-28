import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketServer } from "socket.io";
import { NextApiResponseSocketServer } from "@/types";

// Turn oFF body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

interface ServerOptions {
  path: string;
  addTrailingSlash?: boolean;
  // other properties...
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseSocketServer) => {
  // check if we have a restful endpoint for socket.io server
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;

    const io = new SocketServer(httpServer, {
      path,
      addTrailingSlash: false,
    } as ServerOptions);

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
