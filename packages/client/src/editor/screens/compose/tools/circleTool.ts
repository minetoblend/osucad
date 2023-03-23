import { Graphics } from "pixi.js";
import { defineTool } from "./defineTool";
import { watch } from "vue";

export const CircleTool = defineTool((ctx) => {
  const g = new Graphics();
  g.beginFill(0xffffff, 0.5);
  g.lineStyle(8, 0xffffff);
  g.drawCircle(0, 0, 64);
  g.endFill();

  watch(ctx.mousePosition, (pos) => g.position.copyFrom(pos), {
    immediate: true,
  });
  ctx.createOverlay(g);

  ctx.setCursor("crosshair");
});
