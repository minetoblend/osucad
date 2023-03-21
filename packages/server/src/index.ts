import { MutationSource, ObjectPool } from "@osucad/common/src/pool";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import express from "express";
import { OpCode, HydrateOp, Json } from "@osucad/common/src/protocol";
import { ObjectNode } from "@osucad/common/src/object";
import { deserialize } from "@osucad/common/src/serialize";
import { createState } from "./state";
import { Room } from "./room";

const room = new Room()

const pool = new ObjectPool(new ObjectNode(createState()));

const clients = [] as WebSocket[];

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  room.accept(ws, { displayName: "Anonymous" });
  /*
  clients.push(ws);
  ws.on("close", () => clients.splice(clients.indexOf(ws), 1));

  ws.send(
    JSON.stringify({
      op: "mutation",
      payload: {
        type: OpCode.Hydrate,
        path: "",
        data: pool.root.toHydrationState() as Json,
      } as HydrateOp,
    })
  );

  ws.on("message", (data) => {
    const { op, payload } = JSON.parse(data.toString());

    switch (op) {
      case "mutation": {
        const result = pool.apply(
          deserialize(payload) as any,
          MutationSource.Remote
        );

        for (const client of clients) {
          if (client !== ws) {
            client.send(JSON.stringify({ op: "mutation", payload }));
          }
        }
      }
    }
  });*/
});

server.listen(3000, () => console.log("Listening on port 3000"));
