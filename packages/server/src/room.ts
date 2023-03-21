import { MutationSource, ObjectPool } from "@osucad/common/src/pool";
import { WebSocket } from "ws";
import { Subject, filter } from "rxjs";
import { ObjectNode, OpCode } from "@osucad/common";
import { createState } from "./state";
import { deserialize } from "@osucad/common/src/serialize";

export class Room {
  readonly presences = [] as Presence[];
  readonly message$ = new Subject<MessageEvent>();
  readonly pool = new ObjectPool(new ObjectNode(createState()));

  accept(ws: WebSocket, user: User) {
    const presence = new Presence(this, Math.random().toString(), ws, user);
    this.presences.push(presence);

    ws.on("message", (data) => {
      const { op, payload } = JSON.parse(data.toString());
      this.message$.next({ presence, op, payload });
    });

    ws.on("close", () =>
      this.presences.splice(this.presences.indexOf(presence), 1)
    );

    presence.send("mutation", {
      type: OpCode.Hydrate,
      path: "",
      data: this.pool.root.toHydrationState(),
    });

    this.broadcastUserList();

    return presence;
  }

  constructor() {
    this.message$.pipe(filter((e) => e.op === "mutation")).subscribe((e) => {
      const result = this.pool.apply(
        deserialize(e.payload) as any,
        MutationSource.Remote
      );

      for (const presence of this.presences) {
        if (presence !== e.presence) {
          presence.send("mutation", e.payload);
        }
      }
    });
  }

  broadcastUserList() {
    this.presences.forEach((presence) => {
      presence.send(
        "user-list",
        this.presences.map((p) => ({
          id: p.id,
          user: p.user,
          data: p.data,
        }))
      );
    });
  }
}

export class Presence {
  constructor(
    readonly room: Room,
    readonly id: string,
    readonly ws: WebSocket,
    readonly user: User
  ) {}

  data = {} as any;

  send(op: string, payload: any) {
    this.ws.send(
      JSON.stringify({
        op,
        payload,
      })
    );
  }
}

export type User = {
  displayName: string;
};

type MessageEvent = {
  presence: Presence;
  op: string;
  payload: any;
};
