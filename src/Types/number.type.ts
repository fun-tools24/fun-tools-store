export type FINITE_NUMBER<E extends number, A extends unknown[] = []> = (
    A['length'] extends E ? A[number] | E : FINITE_NUMBER<E, [...A, A['length']]>
)

export type RANGE<S extends number, E extends number> = (
    Exclude<FINITE_NUMBER<E>, FINITE_NUMBER<S>> | S
)
