import { OBJECT_KEYS, OBJECT_VALUE, SUB_OBJECT } from "@/utils/types/object.type";
import runAction, { Action } from "@/utils/functions/runAction";


export type ObjectHandlers<S> = S extends object ? {
    update: <K extends OBJECT_KEYS<S>>(_path: K, val: Action<OBJECT_VALUE<S, K>>) => S;
    updateMany: (val: SUB_OBJECT<S>) => S;
} : {};

export default function objectHandlers<S extends object>(state: S, setState: (value: S) => void): ObjectHandlers<S> {

    if(typeof state !== 'object') return {} as ObjectHandlers<S>;

    return {
        update: <K extends OBJECT_KEYS<S>>(_path: K, val: Action<OBJECT_VALUE<S, K>>): S => {
            const path = _path.toString().split('.');

            const fn = (obj: any, index = 0): S | OBJECT_VALUE<S, K> => {
                if (path.length === index) {
                    return runAction(val, obj);
                }
                const key = path[index];

                return {
                    ...obj,
                    [key]: fn(obj?.[key] ?? {}, index + 1)
                };
            }

            const newState = fn(state) as S;
            setState(newState);

            return newState
        },

        updateMany: (val: SUB_OBJECT<S>): S => {
            const fn = (target: any, source: any) => {
                if (typeof source !== "object" || source === null) return source;
                if (Array.isArray(source)) return source;

                const result = { ...target };

                for (const key in source) {
                    if (Object.prototype.hasOwnProperty.call(target, key)) {
                        result[key] = fn(target[key], source[key]);
                    }
                }

                return result;
            }

            const newState = fn(state, val) as S;
            setState(newState);

            return newState;
        }
    } as ObjectHandlers<S>
}