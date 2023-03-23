import { createPresenceManager } from './presence';
import {
  AbstractNode,
  MutationSource,
  ObjectPool,
  Op,
  OpCode,
  squashOps,
  PresenceData,
} from "@osucad/common";
import { deserialize, serialize } from "@osucad/common/src/serialize";
import { Subject, filter, map, bufferTime, firstValueFrom } from "rxjs";
import { History } from "./history";
import { createUsers } from './users';

export class Client<T extends AbstractNode> {
  
  readonly ws: WebSocket;

  readonly pool: ObjectPool<T>;

  readonly unsentMutations: Op[] = [];

  readonly history: History;

  message$ = new Subject<{ op: string; payload: any }>();

  connected$ = new Subject<void>();

  initialized$ = new Subject<void>();

  presence = createPresenceManager(this)

  id!: string;
  user!: any;

  users = createUsers(this)

  constructor(initialiState: T) {
    this.pool = new ObjectPool(initialiState);
    this.history = new History(this.pool);

    this.ws = new WebSocket("ws://osucad.com:3000");
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

    firstValueFrom(this.message$.pipe(filter((e) => e.op === "init"))).then(
      (e) => {
        this.id = e.payload.id;
        this.user = e.payload.user;
      }
    );

    this.pool.mutation$
      .pipe(
        filter(
          (e) =>
            e.source === MutationSource.Local ||
            e.source === MutationSource.UndoRedo
        ),
        map((e) => e.op),
        bufferTime(250),
        filter(
          (ops) => ops.length > 0 && this.ws.readyState === WebSocket.OPEN
        ),
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

  send(op: string, payload: any) {
    this.ws.send(JSON.stringify({ op, payload }));
  }
}

type User = {
  displayName: string;
};
