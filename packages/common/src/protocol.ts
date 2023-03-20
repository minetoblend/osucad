export type Json = string | number | boolean | null | Json[] | JsonObject
export type JsonObject = { [key: string]: Json }

export const enum OpCode {
  Hydrate = 0,
  Update = 1,
  Insert = 2,
  Remove = 3,
}

export type HydrateOp = {
  readonly type: OpCode.Hydrate
  readonly opId?: string
  readonly path: string
  readonly data: any
}

export type UpdateOp = {
  readonly type: OpCode.Update
  readonly opId?: string
  readonly path: string
  readonly data: any
}

export type InsertOp = {
  readonly type: OpCode.Insert
  readonly opId?: string
  readonly path: string
}

export type RemoveOp = {
  readonly type: OpCode.Remove
  readonly opId?: string
  readonly path: string
}

export type Op = HydrateOp | UpdateOp | InsertOp | RemoveOp

export const enum NodeType {
  Object = 0,
}

export type SerializedObject = {
  $type: NodeType.Object,
  data: JsonObject
}