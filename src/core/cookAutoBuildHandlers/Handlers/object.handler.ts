import { OBJECT_KEYS, OBJECT_VALUE, SUB_OBJECT } from "../../../Types/object.type";


function objectHandlers<S extends object>(state: S, notify: <A>(a?: A) => A) {
    return {
        update: (_path: OBJECT_KEYS<S>, val: OBJECT_VALUE<S, OBJECT_KEYS<S>>) => {
            const path = _path.toString().split('.');

            const fn = (obj: any, index = 0): S | typeof val => {
                if (path.length === index) return val;
                const key = path[index];

                return {
                    ...obj,
                    [key]: fn(obj?.[key] ?? {}, index + 1)
                };
            }

            state = fn(state) as S;

            return notify(state)
        },

        updateMany: (val: SUB_OBJECT<S>) => {
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

            state = fn(state, val) as S;

            return notify(state)
        }
    }
}


type ObjectHandlers<S extends object> = ReturnType<typeof objectHandlers<S>>



export {
    ObjectHandlers,
    objectHandlers as default
}