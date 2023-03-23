import { AbstractNode } from "./node";
import { ObjectNode } from "./object";
import { Json, JsonObject, NodeType } from "./protocol";

export function deserialize(data: unknown): unknown {
  if (typeof data === "object" && data !== null) {
    if (data instanceof AbstractNode) return data;

    if (
      "$type" in data &&
      typeof data.$type === "number" &&
      "data" in data &&
      typeof data.data === "object" &&
      data.data !== null
    ) {
      switch (data.$type) {
        case NodeType.Object:
          return deserializeObject(data.data as JsonObject);
        default:
          throw new Error("Unknown node type");
      }
    }

    const deserialized = {} as any;
    for (const key in data) {
      deserialized[key] = deserialize((data as any)[key]);
    }

    return deserialized;
  }

  return data;
}
function deserializeObject(data: JsonObject) {
  const serializedData = {} as any;
  for (const key in data) serializedData[key] = deserialize(data[key]);
return new ObjectNode(serializedData);
}

export function serialize(data: unknown): Json {
  if (typeof data === "object" && data !== null) {
    if (data instanceof AbstractNode) return data.serialize();
    const serialized = {} as JsonObject;
    for (const key in data) serialized[key] = serialize((data as any)[key]);
    return serialized;
  }

  return data as Json;
}
