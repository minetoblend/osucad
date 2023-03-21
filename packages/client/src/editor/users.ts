import { shallowReactive, shallowRef } from "vue";
import { Subject, filter } from "rxjs";
import { Client } from "./client";

export function createUsers(messages$: Subject<any>) {
  const users = shallowRef([] as Presence[]);

  messages$
    .pipe(filter((e) => e.op === "user-list"))
    .subscribe((e) => (users.value = e.payload));

  return {
    users,
  };
}

type Presence = {
  id: string;
  user: {
    displayName: string;
  };
};
