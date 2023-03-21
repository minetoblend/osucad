import { ObjectNode } from "@osucad/common";
export function createState() {
  return {
    metadata: new ObjectNode({
      artistUnicode: "",
      artist: "",
      titleUnicode: "",
      title: "",
      difficulty: "",
    }),

    difficulty: new ObjectNode({
      healthDrain: 5,
      circleSize: 4,
      approachRate: 8.5,
      overallDifficulty: 8,
    }),
  };
}
