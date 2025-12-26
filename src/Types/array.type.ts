export type JOIN_ARRAY<A extends string[], C extends string, S extends string='', I extends unknown[] = []> = (
    I['length'] extends A['length'] ? S : `${S}${I['length'] extends 0 ? '' : C}${JOIN_ARRAY<A, C, A[I['length']], [...I, unknown]>}`
)

export type ARRAY<T, L extends number, R extends Array<T> = []> = (
    R['length'] extends L ? R : ARRAY<T, L, [...R, T]>
)
