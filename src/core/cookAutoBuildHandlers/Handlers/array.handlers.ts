import runAction, { Action } from "../../../Utils/runAction";



function arrayHandlers<S extends Array<any>, V = S extends Array<infer T> ? T : never>(state: Array<V>, notify: <A>(a?: A) => A | undefined) {

    return {
        push: (val: V) => {
            state = [...state, val];
            return notify(val);
        },

        pop: () => {
            state = state.slice(0, -1);
            return notify(state[state.length - 1]);
        },

        shift: () => {
            state = state.slice(1);
            return notify(state[0]);
        },

        unshift: (val: V) => {
            state = [val, ...state];
            return notify(val);
        },

        filter: (cb: (item: V) => boolean) => {
            state = state.filter(cb);
            return notify(state);
        },

        map: (cb: (item: V) => V) => {
            state = state.map(cb);
            return notify(state);
        },

        sort: (cb: (item: V) => number) => {
            state = [...state.sort(cb)];
            return notify(state);
        },
    }
} 



type ArrayHandlers<A, T = A extends Array<infer T> ? T : never> = ReturnType<typeof arrayHandlers<Array<T>>>


export {
    ArrayHandlers,
    arrayHandlers as default
}