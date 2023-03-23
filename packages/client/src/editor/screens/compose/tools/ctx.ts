import { useMouse } from "@vueuse/core";
import { Container, DisplayObject } from "pixi.js";
import { computed } from "vue";

export class ToolContext {
  constructor(
    private readonly stage: Container,
    private readonly overlayContainer: Container
  ) {}

  get mousePosition() {
    const pos = useMouse();
    return computed(() => ({
      x: pos.x.value,
      y: pos.y.value,
    }));
  }

  createOverlay = (...children: DisplayObject[]) => {
    this.overlayContainer.removeChildren();
    this.overlayContainer.addChild(...children);
  };

  setCursor(cursor: string) {
    this.stage.cursor = cursor;
  }
}
