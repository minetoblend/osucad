import { ToolContext } from "./ctx";

export function defineTool(
  setup: (ctx: ToolContext) => void
) {
  return setup;
}