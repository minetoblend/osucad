import { Subject } from 'rxjs';
import { shallowReactive } from "vue";
import { AbstractNode, MutationResult } from "../node";
import { MutationSource } from "../pool";
import { Op } from "../protocol";
import { ObjectNode } from "../object";

export class TimingState extends AbstractNode {
  timingPoints = shallowReactive([] as ObjectNode<TimingPoint>[]);

  readonly inserted$ = new Subject<TimingPoint>();

  #insert(timingPoint: TimingPoint) {
    const { found, index } = this.binarySearch(timingPoint.offset);
    this.timingPoints.splice(index, 0, new ObjectNode(timingPoint));
  }

  binarySearch(offset: number): { found: boolean; index: number } {
    let left = 0;
    let right = this.timingPoints.length - 1;
    let mid = 0;
    while (left <= right) {
      mid = Math.floor((left + right) / 2);
      const timingPoint = this.timingPoints[mid];
      if (timingPoint.offset === offset) {
        return { found: true, index: mid };
      } else if (timingPoint.offset < offset) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return { found: false, index: mid };
  }

  getChild(key: string): AbstractNode<any> {
    return this.timingPoints.find((timingPoint) => timingPoint.id === key);
  }

  getChildren(): AbstractNode<any>[] {
    return this.timingPoints;
  }

  apply(op: Op, source: MutationSource): MutationResult {
    switch (op.type) {
      default:
        throw new Error("Invalid op");
    }
  }

  serialize() {
    return this.timingPoints.map((timingPoint) => timingPoint.serialize());
  }

  toPlain() {
    return this.timingPoints.map((timingPoint) => timingPoint.toPlain());
  }

  hydrate(data: any): void {}
}

interface TimingPoint {
  offset: number;

  beatLength: number;
}
