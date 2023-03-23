import { TypedObjectNode } from "..";

export interface Difficulty {
  healthDrain: number;
  circleSize: number;
  approachRate: number;
  overallDifficulty: number;
  sliderMultiplier: number;
  sliderTickRate: number;
}

export class DifficultyState extends TypedObjectNode<Difficulty>() {
  constructor() {
    super({
      healthDrain: 5,
      circleSize: 4,
      approachRate: 8.5,
      overallDifficulty: 8,
      sliderMultiplier: 1.4,
      sliderTickRate: 1,
    } as Difficulty);
  }
}
