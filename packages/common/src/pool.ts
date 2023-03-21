import { ObjectNode } from "./object";
import { Op } from "./protocol";
import { Subject } from "rxjs";
import { AbstractNode } from "./node";

export class ObjectPool<T extends object = {}> {
  readonly root: ObjectNode<T>;

  readonly mutation$ = new Subject<MutationEvent>();

  constructor(state: ObjectNode<T>) {
    this.root = state;
    this.root.setPool(this);
  }

  apply(op: Op, source: MutationSource) {
    const node = this.root.find(op.path);
    if (!node) throw new Error("Node not found");
    return node.apply(op, source);
  }
}

export type MutationEvent = {
  node: AbstractNode;
  op: Op;
  reverse: Op;
  source: MutationSource;
};

export const enum MutationSource {
  Local = 0,
  Remote = 1,
  UndoRedo = 2,
}
