import { MutationSource, ObjectPool } from "@osucad/common";
import { deserialize } from "@osucad/common/src/serialize";

const pool = new ObjectPool();

const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (e) => {
  const { op, payload } = JSON.parse(e.data);

  switch (op) {
    case "mutation": {
      pool.apply(deserialize(payload) as any, MutationSource.Remote);
    }
  }

  pool.root.get("foo").set("bar", "bat");
};

pool.mutation$.subscribe((e) => {
  if (e.source === MutationSource.Local) {
    ws.send(JSON.stringify({ op: "mutation", payload: e.op }));
  }
});
