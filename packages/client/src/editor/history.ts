import { ObjectPool, Op, MutationSource, squashOps } from "@osucad/common";
import { shallowReactive, watchEffect } from "vue";
import { filter } from "rxjs";

export class History {
  constructor(readonly pool: ObjectPool) {
    pool.mutation$
      .pipe(filter((e) => e.source === MutationSource.Local))
      .subscribe((e) => this.record(e.reverse));

    watchEffect(() => {
      console.log([...this.undoStack]);
    });
  }

  undoStack = shallowReactive([] as HistoryEntry[]);
  redoStack = shallowReactive([] as HistoryEntry[]);

  activeEntry: HistoryEntry | null = null;

  pause() {
    this.activeEntry = { ops: [] };
  }

  resume() {
    if (this.activeEntry) {
      this.activeEntry.ops = squashOps(this.activeEntry.ops);

      this.undoStack.push(this.activeEntry);
      this.activeEntry = null;
    }
  }

  record(...ops: Op[]) {
    if (this.redoStack.length) this.redoStack.length = 0;

    if (this.activeEntry) {
      return this.activeEntry.ops.unshift(...ops.reverse());
    }

    this.undoStack.push({ ops });
  }

  undo() {
    const entry = this.undoStack.pop();
    if (!entry) return;

    const reverse = [] as Op[];
    entry.ops.forEach((op) => {
      const result = this.pool.apply(op, MutationSource.UndoRedo);
      if (result.modified) reverse.unshift(result.reverse);
    });

    this.redoStack.push({ ops: reverse });
  }

  redo() {
    const entry = this.redoStack.pop();
    if (!entry) return;

    const reverse = [] as Op[];
    entry.ops.forEach((op) => {
      const result = this.pool.apply(op, MutationSource.UndoRedo);
      if (result.modified) reverse.unshift(result.reverse);
    });

    this.undoStack.push({ ops: reverse });
  }

  get canUndo() {
    return this.undoStack.length > 0;
  }

  get canRedo() {
    return this.redoStack.length > 0;
  }
}

export type HistoryEntry = {
  ops: Op[];
};
