import { EditorState, DifficultyState, MetadataState } from "@osucad/common";
import { Client } from "./client";
import { firstValueFrom } from "rxjs";
import { History } from "./history";
import { PresenceManager } from "./presence";

let currentEditor: EditorInstance | undefined;

export async function createEditor() {
  const client = new Client(new EditorState());

  await firstValueFrom(client.initialized$);

  const editor: EditorInstance = {
    client,
    history: client.history,
    state: client.state,
    metadata: client.state.metadata,
    difficulty: client.state.difficulty,
    presence: client.presence,
  };

  currentEditor = editor;

  return editor;
}

export type EditorInstance = {
  client: Client<EditorState>;
  history: History;
  state: EditorState;
  presence: PresenceManager;

  metadata: MetadataState;
  difficulty: DifficultyState;
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
