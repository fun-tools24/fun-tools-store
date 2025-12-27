

export type BoolHandlers<S> = S extends boolean ? {
    toggle: () => boolean;
} : {};

export default function boolHandlers<S extends boolean>(getState: () => S, setState: (value: S) => void): BoolHandlers<S> {

    if(typeof getState() !== 'boolean') return {} as BoolHandlers<S>;

    return {
        toggle: () => {
            const state = getState();
            setState(!state as S);

            return state;
        }
    }
}
