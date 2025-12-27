import runAction, { Action } from "@/utils/functions/runAction";


export type ArrayHandlers<S extends Array<any>, V = S extends Array<infer T> ? T : never> = S extends Array<V> ? {
    push: (val: V) => V;
    pop: () => V;
    shift: () => V;
    unShift: (val: V) => V;
    update: (index: number, val: Action<V>) => V;
    remove: (index: number) => V;
} : {}


export default function arrayHandlers<S extends Array<any>, V = S extends Array<infer T> ? T : never>(
    state: S, setState: (value: S) => void
): ArrayHandlers<S, V> {

    if(!Array.isArray(state)) return {} as ArrayHandlers<S, V>;

    return {
        push: (val: V) => {
            setState([...state, val] as S);
            return val;
        },

        pop: () => {
            setState(state.slice(0, -1) as S);
            return state[state.length - 1];
        },

        shift: () => {
            setState(state.slice(1) as S);
            return state[0];
        },

        unShift: (val: V) => {
            setState([val, ...state] as S);
            return val;
        },

        update: (index: number, val: Action<V>) => {
            const newState = [...state];
            newState[index] = runAction(val, state[index]);
            setState(newState as S);
            return newState[index];
        },

        remove: (index: number) => {
            const removed = state[index];
            const newState = state.filter((_, i) => i !== index);
            setState(newState as S);
            return removed;
        }
    }
}