import { PresenceData } from "./../../../common/src/presence";
import { ref } from "vue";
import { Subject, filter } from "rxjs";
import { Client } from "./client";

export function createUsers(client: Client<any>) {
  const users = ref<Presence[]>([]);

  client.message$.pipe(filter((e) => e.op === "user-list")).subscribe(
    (e) =>
      (users.value = e.payload.map((p: Omit<Presence, "isSelf">) => ({
        ...p,
        isSelf: p.id === client.id,
      })))
  );

  client.message$
    .pipe(filter((e) => e.op === "presence.update"))
    .subscribe((e) => {
      const { id, data } = e.payload;
      const user = users.value.find((u) => u.id === id);
      if (user) {
        user.data = data;
      }
    });

  return {
    users,
  };
}

export interface Presence {
  id: string;
  user: {
    displayName: string;
  };
  data: PresenceData;
  isSelf: boolean;
  color: string;
}
