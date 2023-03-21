import { ObjectNode } from "@osucad/common/src/object";
import {
  MutationSource,
  ObjectPool,
  Op,
  OpCode,
  squashOps,
} from "@osucad/common";
import { deserialize, serialize } from "@osucad/common/src/serialize";
import { Subject, filter, map, bufferTime } from "rxjs";
import { History } from "./history";

export class Client<T extends object> {
  readonly ws: WebSocket;

  readonly pool: ObjectPool<T>;

  readonly unsentMutations: Op[] = [];

  readonly history: History;

  message$ = new Subject<{ op: string; payload: any }>();

  connected$ = new Subject<void>();

  initialized$ = new Subject<void>();

  constructor(initialiState: T = {} as T) {
    this.pool = new ObjectPool(new ObjectNode(initialiState));
    this.history = new History(this.pool);

    this.ws = new WebSocket("ws://localhost:3000");
    this.ws.onopen = () => this.connected$.next();
    this.ws.onerror = (e) => this.connected$.error(e);
    this.ws.onmessage = (e) => this.message$.next(JSON.parse(e.data));
    this.init();
  }

  get state() {
    return this.pool.root;
  }

  init() {
    this.message$.pipe(filter((e) => e.op === "mutation")).subscribe((e) => {
      this.pool.apply(deserialize(e.payload) as any, MutationSource.Remote);
      if (e.payload.type === OpCode.Hydrate && e.payload.path.length === 0)
        this.initialized$.next();
    });

    this.message$.subscribe((e) => console.log(e));

    this.message$
      .pipe(filter((e) => e.op === "mutation"))
      .subscribe((e) => console.log(e.payload));

    this.pool.mutation$
      .pipe(
        filter(
          (e) =>
            e.source === MutationSource.Local ||
            e.source === MutationSource.UndoRedo
        ),
        map((e) => e.op),
        bufferTime(100),
        filter(
          (ops) => ops.length > 0 && this.ws.readyState === WebSocket.OPEN
        ),
        map(squashOps)
      )
      .subscribe((ops) => {
        console.log(ops);

        ops.forEach((op) =>
          this.ws.send(
            JSON.stringify({ op: "mutation", payload: serialize(op) })
          )
        );
      });
  }
}


type User = {
  displayName: string
}