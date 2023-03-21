import { ObjectNode } from "@osucad/common/src/object";
import { ComputedRef } from "vue";

export function createDifficulty(state: ComputedRef<ObjectNode<Difficulty>>) {
  return new Proxy(state, {
    get: (target, prop) => {
      return target.value?.get(prop as any);
    },
    set: (target, prop, value) => {
      target.value?.set(prop as any, value);
      return true;
    },
  }) as unknown as Difficulty;
}

export interface Difficulty {
  healthDrain: number;
  circleSize: number;
  approachRate: number;
  overallDifficulty: number;
}
