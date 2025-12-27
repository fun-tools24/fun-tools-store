

export type BoolHandlers<S> = S extends boolean ? {
    toggle: () => boolean;
} : {};

export default function boolHandlers<S extends boolean>(state: S, setState: (value: S) => void): BoolHandlers<S> {

    if(typeof state !== 'boolean') return {} as BoolHandlers<S>;

    return {
        toggle: () => {
            state = !state as S;
            setState(state);

            return state;
        }
    }
}
