export type OBJECT_KEYS<T extends object> = {
    [K in keyof T]: K extends string | number 
        ? T[K] extends object 
            ? K | `${K}.${OBJECT_KEYS<T[K]>}` 
            : K
        : never
}[keyof T]


export type OBJECT_VALUE<O extends Record<string, any>, P extends string | number> = (
    P extends `${infer K}.${infer P}` ? 
        K extends keyof O ? 
            OBJECT_VALUE<O[K], P>
        : never
    : P extends keyof O ? O[P] : never
)


export type OBJECT_FROM_KEYS<O extends Record<string, any> , K extends string[], I extends unknown[] = []> = (
    I['length'] extends K['length'] ? {} 
    : (
        K[I['length']] extends `${infer P}:${infer N}` ? (
            Record<N, OBJECT_VALUE<O, P>> & OBJECT_FROM_KEYS<O, K, [...I, unknown]> 
        ) : K[I['length']] extends `${infer _N}.${infer N}` ? (
            Record<N, OBJECT_VALUE<O, K[I['length']]>> & OBJECT_FROM_KEYS<O, K, [...I, unknown]> 
        ) : Record<K[I['length']], O[K[I['length']]]> & OBJECT_FROM_KEYS<O, K, [...I, unknown]> 
    )
)


export type SUB_OBJECT<O extends Record<string, any>> = {
    [K in keyof O]?: O[K] extends Record<string, any> ? SUB_OBJECT<O[K]> : O[K]
}
