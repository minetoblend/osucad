import { MutationSource, ObjectPool } from "@osucad/common/src/pool";
import { WebSocket } from "ws";
import { Subject, filter } from "rxjs";
import { OpCode, EditorState } from "@osucad/common";
import { deserialize } from "@osucad/common/src/serialize";
import { getRandomColor } from "./util/randomColor";

export class Room {
  readonly presences = [] as Presence[];
  readonly message$ = new Subject<MessageEvent>();
  readonly pool = new ObjectPool(new EditorState());

  accept(ws: WebSocket, user: User) {
    const presence = new Presence(this, Math.random().toString(), ws, user);
    this.presences.push(presence);

    ws.on("message", (data) => {
      const { op, payload } = JSON.parse(data.toString());
      this.message$.next({ presence, op, payload });
    });

    ws.on("close", () => {
      this.presences.splice(this.presences.indexOf(presence), 1);
      this.broadcastUserList();
    });

    presence.send("init", {
      id: presence.id,
      user: presence.user,
    });

    presence.send("mutation", {
      type: OpCode.Hydrate,
      path: "",
      data: this.pool.root.serialize(),
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
    this.initPresence();
  }
  initPresence() {
    this.message$
      .pipe(filter((e) => e.op === "presence.update"))
      .subscribe((e) => {
        e.presence.data = e.payload;
        this.broadcast("presence.update", {
          id: e.presence.id,
          data: e.presence.data,
        });
      });
  }

  broadcastUserList() {
    this.broadcast(
      "user-list",
      this.presences.map((p) => ({
        id: p.id,
        user: p.user,
        data: p.data,
        color: p.color,
      }))
    );
  }

  broadcast(op: string, payload: any) {
    this.presences.forEach((presence) => {
      presence.send(op, payload);
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

  color = getRandomColor()

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
