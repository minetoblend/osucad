import { ObjectNode } from "@osucad/common/src/object";
import { ComputedRef } from "vue";

export function createMetadata(state: ComputedRef<ObjectNode<Metadata>>) {
  return new Proxy(state, {
    get: (target, prop) => {
      return target.value?.get(prop as any);
    },
    set: (target, prop, value) => {
      target.value?.set(prop as any, value);
      return true;
    },
  }) as unknown as Metadata;
}

export interface Metadata {
  titleUnicode: string;
  title: string;
  artistUnicode: string;
  artist: string;
  difficulty: string;
}
