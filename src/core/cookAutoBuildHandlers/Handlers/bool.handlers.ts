function boolHandlers(state: boolean, notify: <A>(a?: A) => A) {
    return {
        toggle: () => {
            state = !state;
            return notify(state);
        }
    }
}


type BoolHandlers = ReturnType<typeof boolHandlers>

export {
    boolHandlers as default,
    BoolHandlers
}