import { Difficulty, createDifficulty } from "./difficulty";
import { Metadata, createMetadata } from "./metadata";
import { ObjectNode, OpCode } from "@osucad/common";
import { Client } from "./client";
import { firstValueFrom } from "rxjs";
import { History } from "./history";
import { computed } from "vue";

let currentEditor: EditorInstance | undefined;

export async function createEditor() {
  const client = new Client({
    // metadata: new ObjectNode<Metadata>({} as Metadata),
    // difficulty: new ObjectNode<Difficulty>({} as Difficulty),
  } as any);

  await firstValueFrom(client.initialized$);

  console.log(client.state.getChild("metadata"));

  const editor: EditorInstance = {
    history: client.history,
    state: client.state,
    metadata: createMetadata(computed(() => client.state.get("metadata"))),
    difficulty: createDifficulty(
      computed(() => client.state.get("difficulty"))
    ),
  };

  currentEditor = editor;

  console.log("init");

  return editor;
}

export type EditorInstance = {
  history: History;
  state: ObjectNode<any>;

  metadata: Metadata;
  difficulty: Difficulty;
};

export function useEditor() {
  if (!currentEditor) {
    throw new Error("No editor instance found");
  }
  return currentEditor;
}

export function tryUseEditor() {
  return currentEditor;
}
