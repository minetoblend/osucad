import { PresenceData } from "@osucad/common";
import { ref, watch } from "vue";
import { Client } from "./client";
import { watchThrottled } from "@vueuse/core";

export function createPresenceManager(client: Client<any>) {
  const currentPresence = ref<PresenceData>({
    mode: null,
    cursor: null,
  });

  watchThrottled(
    currentPresence,
    (presence) => {
      client.send("presence.update", presence);
    },
    { deep: true, throttle: 50 }
  );

  return {
    current: currentPresence,
  };
}

export type PresenceManager = ReturnType<typeof createPresenceManager>;
