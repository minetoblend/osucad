import { MutationSource, ObjectPool, Op, OpCode, squashOps } from "@osucad/common";
import { deserialize, serialize } from "@osucad/common/src/serialize";
import { Subject, filter, windowTime, map, bufferTime } from "rxjs";
import { History } from "./history";

export class Client<T extends object> {
  readonly ws: WebSocket;

  readonly pool = new ObjectPool<T>();

  readonly unsentMutations: Op[] = [];

  readonly history = new History(this.pool)

  message$ = new Subject<{ op: string; payload: any }>();

  conected$ = new Subject<void>();

  constructor() {
    this.ws = new WebSocket("ws://localhost:3000");
    this.ws.onopen = () => this.conected$.next();
    this.ws.onerror = (e) => this.conected$.error(e);
    this.ws.onmessage = (e) => this.message$.next(JSON.parse(e.data));
    this.init();
  }

  get state() {
    return this.pool.root;
  }

  init() {
    this.message$
      .pipe(filter((e) => e.op === "mutation"))
      .subscribe((e) => this.pool.apply(deserialize(e.payload) as any, MutationSource.Remote));

    this.message$
      .pipe(filter((e) => e.op === "mutation"))
      .subscribe((e) => console.log(e.payload));

    this.pool.mutation$
      .pipe(
        filter((e) => e.source === MutationSource.Local || e.source === MutationSource.UndoRedo),
        map((e) => e.op),
        bufferTime(25),
        filter((ops) => ops.length > 0 && this.ws.readyState === WebSocket.OPEN),
        map(squashOps)
      )
      .subscribe((ops) => {
        ops.forEach((op) =>
          this.ws.send(
            JSON.stringify({ op: "mutation", payload: serialize(op) })
          )
        );
      });
  }
}
