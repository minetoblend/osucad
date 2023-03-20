import { Subject } from "rxjs";
import { MutationEvent, MutationSource, ObjectPool } from "./pool";
import { Op } from "./protocol";

export abstract class AbstractNode<Serialized = any> {
  id?: string;
  parent?: AbstractNode;
  path: string = '';
  pool?: ObjectPool;

  readonly mutation$ = new Subject<MutationEvent>();

  abstract getChild(key: string): AbstractNode | undefined;

  abstract getChildren(): AbstractNode[];

  abstract apply(op: Op, source: MutationSource): MutationResult;

  constructor() {}

  find(path: string): AbstractNode | undefined {
    if (path.length === 0) return this;
    const index = path.indexOf(".");
    const key = index === -1 ? path : path.slice(0, index);
    const child = this.getChild(key);
    if (!child) return undefined;
    return child.find(index === -1 ? "" : path.slice(index + 1));
  }

  attach(parent: AbstractNode, key: string) {
    this.parent = parent;
    this.id = key;
    this.path = parent.path ? `${parent.path}.${key}` : key;
    if (parent.pool) this.setPool(parent.pool);
  }

  detach() {
    this.parent = undefined;
    this.id = undefined;
    this.path = '';
    this.setPool(undefined);
  }

  setPool(pool: ObjectPool | undefined) {
    this.pool = pool;
    this.getChildren().forEach((child) => child.setPool(pool));

    if (pool) {
      this.mutation$.subscribe(pool.mutation$);
    }
  }

  abstract serialize(): Serialized;

  abstract toPlain(): any;

  abstract toHydrationState(): any;
}

export type MutationResult =
  | { modified: false }
  | { modified: true; op: Op; reverse: Op };
