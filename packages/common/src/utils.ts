import { Op, OpCode, UpdateOp } from "./protocol";

export function squashOps(ops: Op[]): Op[] {
  return ops
    .map((op, index, arr) => {
      if (op.type === OpCode.Update) {
        for (let i = index + 1; i < arr.length; i++) {
          if (op.type === OpCode.Update && op.path === arr[i].path) {
            const op2 = arr[i] as UpdateOp;
            for (const key in op2.data) {
              delete op.data[key];
            }
          }
        }
      }
      return op;
    })
    .filter((op) => {
      if (op.type === OpCode.Update) {
        return Object.keys(op.data).length > 0;
      }
      return true;
    })
    .reduce((acc, op) => {
      if (op.type === OpCode.Update) {
        const lastOp = acc[acc.length - 1];
        if (lastOp && lastOp.type === OpCode.Update && lastOp.path === op.path) {
          for (const key in op.data) {
            lastOp.data[key] = op.data[key];
          }
          return acc;
        }
      }
      return [...acc, op];
    }, [] as Op[])
    ;
}
