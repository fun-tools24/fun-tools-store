export type UseSelector<A, R=A> = {
    (): R,
    <T>(cb: (s: A) => T) : T
}


export type GET_PROPS<F> = (
    F extends (props: infer P) => infer R ? P : never
)