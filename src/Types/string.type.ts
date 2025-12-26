export type SPLIT_STRING<S extends string, C extends string> = (
    S extends `${infer H}${C}${infer T}` ? [H, ...SPLIT_STRING<T, C>]: [S]
)