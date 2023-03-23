import {
  Op,
  OpCode,
  MutationSource,
  AbstractNode,
  MutationResult,
  UpdateOp,
  JsonObject,
} from ".";
import { shallowReactive } from "vue";
import { serialize } from "./serialize";
export class StaticObjectNode<T extends object> extends AbstractNode {
  readonly state: T;

  constructor(state: T) {
    super();

    for (const key in state) {
      const value = state[key] as any;
      if (value instanceof AbstractNode) value.attach(this, key);

      Reflect.defineProperty(this, key, {
        get: () => this.get(key),
        set: (value: any) => this.set(key, value),
        enumerable: true,
      });
    }

    this.state = shallowReactive(state);
  }

  apply(op: Op, source: MutationSource) {
    switch (op.type) {
      case OpCode.Hydrate:
        return this.hydrate(op.data as T);
      case OpCode.Update:
        return this.update(op.data as Partial<T>, source);
      default:
        throw new Error("Invalid op");
    }
  }

  update(
    data: Partial<T>,
    source: MutationSource = MutationSource.Local
  ): MutationResult {
    const changed = {} as Partial<T>;
    const reverse = {} as Partial<T>;
    for (const key in data) {
      const value = data[key] as any;
      const oldValue = this.state[key];

      if (oldValue === value) continue;

      if (oldValue instanceof AbstractNode) {
        oldValue.detach();
      }
      if (value instanceof AbstractNode) {
        value.attach(this, key);
      }

      this.state[key] = value;
      changed[key] = value;
      reverse[key] = oldValue;
    }

    if (Object.keys(changed).length === 0) return { modified: false };

    const op: UpdateOp = {
      type: OpCode.Update,
      path: this.path!,
      data: changed,
    };
    const reverseOp: UpdateOp = {
      type: OpCode.Update,
      path: this.path!,
      data: reverse,
    };

    if (this.path) {
      this.mutation$.next({
        node: this,
        op,
        reverse: reverseOp,
        source,
      });
    }

    return {
      modified: true,
      op,
      reverse: reverseOp,
    };
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }

  getChild(key: string): AbstractNode | undefined {
    const value = this.get(key as any) as any;

    if (value instanceof AbstractNode) return value;

    return undefined;
  }

  hydrate(data: T): MutationResult {
    for (const key in data) {
      const value = data[key];
      const oldValue = this.state[key];

      if (oldValue instanceof AbstractNode) {
        oldValue.hydrate(value);
        continue;
      }

      if (oldValue instanceof AbstractNode) oldValue.detach();
      if (value instanceof AbstractNode) value.attach(this, key);

      this.state[key] = value;
    }

    return {
      modified: false,
    };
  }

  serialize() {
    return serialize(this.state) as JsonObject;
  }

  toPlain() {
    const plain = {} as any;
    for (const key in this.state) {
      const value = this.state[key];
      if (value instanceof AbstractNode) plain[key] = value.toPlain();
      else plain[key] = value;
    }
    return plain;
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    this.update({ [key]: value } as any);
  }

  getChildren(): AbstractNode<any>[] {
    return Object.values(this.state).filter((it) => it instanceof AbstractNode);
  }
}
