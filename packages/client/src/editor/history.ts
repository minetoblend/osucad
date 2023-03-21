import { ObjectPool, Op, MutationSource, squashOps } from "@osucad/common";
import { shallowReactive, watchEffect } from "vue";
import { Subject, filter } from "rxjs";
import { useEventListener } from "@vueuse/core";
import { useQuasar } from "quasar";

export class History {
  undo$ = new Subject<void>();
  redo$ = new Subject<void>();

  constructor(readonly pool: ObjectPool) {
    pool.mutation$
      .pipe(filter((e) => e.source === MutationSource.Local))
      .subscribe((e) => this.record(e.reverse));

    useEventListener("keydown", (evt) => {
      if (evt.key === "z" && evt.ctrlKey) {
        evt.preventDefault();
        this.undo();
      }
      if (evt.key === "y" && evt.ctrlKey) {
        evt.preventDefault();
        this.redo();
      }
    });

    const $q = useQuasar();

    this.undo$.subscribe(() => $q.notify({
      message: "Undo",
      position: "top",
      classes: 'transition-short',
      timeout: 100
    }));
    this.redo$.subscribe(() => $q.notify({
      message: "Redo",
      position: "top",
      classes: 'transition-short',
      timeout: 100
    }));
  }

  undoStack = shallowReactive([] as HistoryEntry[]);
  redoStack = shallowReactive([] as HistoryEntry[]);

  activeEntry: HistoryEntry | null = null;

  pause(ignoreExisting = false) {
    if (this.activeEntry) {
      if (ignoreExisting) return;
      throw new Error("Cannot pause history while it is already paused");
    }
    this.activeEntry = { ops: [] };
  }

  resume() {
    if (this.activeEntry) {
      this.activeEntry.ops = squashOps(this.activeEntry.ops);

      if (this.activeEntry.ops.length) this.undoStack.push(this.activeEntry);
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
    if (this.activeEntry) {
      this.resume();
      this.undo();
      this.pause();
      return;
    }

    const entry = this.undoStack.pop();
    if (!entry) return;

    const reverse = [] as Op[];
    entry.ops.forEach((op) => {
      const result = this.pool.apply(op, MutationSource.UndoRedo);
      if (result.modified) reverse.unshift(result.reverse);
    });

    this.redoStack.push({ ops: reverse });

    this.undo$.next();
  }

  redo() {
    if (this.activeEntry) {
      this.resume();
      this.redo();
      this.pause();
      return;
    }

    const entry = this.redoStack.pop();
    if (!entry) return;

    const reverse = [] as Op[];
    entry.ops.forEach((op) => {
      const result = this.pool.apply(op, MutationSource.UndoRedo);
      if (result.modified) reverse.unshift(result.reverse);
    });
    this.undoStack.push({ ops: reverse });

    this.redo$.next();
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
