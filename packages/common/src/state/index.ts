import { TimingState } from "./timing";
import { StaticObjectNode } from "./../staticObject";
import { DifficultyState } from "./difficulty";
import { MetadataState } from "./metadata";

export * from "./difficulty";
export * from "./metadata";

export class EditorState extends StaticObjectNode<{
  metadata: MetadataState;
  difficulty: DifficultyState;
  timing: TimingState;
}> {
  constructor() {
    super({
      metadata: new MetadataState(),
      difficulty: new DifficultyState(),
      timing: new TimingState(),
    });
  }

  metadata!: MetadataState;

  difficulty!: DifficultyState;

  timing!: TimingState;
}
