import { OBJECT_KEYS, OBJECT_VALUE } from "../Types/object.type";


export type States = Record<string, any>;
export type Action<T> = T | ((val: T) => T);


export type Handler<S, V> = (
    V extends (state: S) => infer R ? (
        (state: S) => R
    ) : V extends (state: S, action: infer A) => infer R ? (
        (state: S, action: A) => R
    ) : never
) 


export type SyncHandler<S> = Handler<S, (state: S, action: any) => any>;
export type AsyncHandler<S> = Handler<S, (state: S, action: any) => Promise<any>>;


export type SyncHandlerRecord<S, SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>> = {
    [K in keyof SH]: Handler<S, SH[K]>
};


export type AsyncHandlerRecord<S, AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>> = {
    [K in keyof AH]: Handler<S, AH[K]>
};



export type CreateStoreContextProps<
    S extends States,
    SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>,
    AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>
> = {
    states: S,
    syncHandlers?: SH,
    asyncHandlers?: AH
}



export type AutoBuildHandler<V> = {
    set: (cb: Action<V>) => void,
    reset: () => void
} & (
    V extends Array<infer T> ? {
        push: (val: T) => void,
        pop: () => T | null,
        shift: () => T | null,
        unshift: (val: T) => void,
        filter: (cb: (item: T) => boolean) => void,
        map: (cb: (item: T) => T) => void
    } : V extends States ? {
        update: (key: OBJECT_KEYS<V>, val: OBJECT_VALUE<V, OBJECT_KEYS<V>>) => void,
        updateMany: (val: Partial<V>) => void
    } : {}
)



export type AutoBuildHandlerRecord<S extends States> = {
    [K in keyof S]: AutoBuildHandler<S[K]>
}



export type ExtractActionType<T> = T extends (state: States, action: infer A) => void ? A : never;



type ReturnHandlers<S, V> = (
    V extends (state: S) => infer R ? (
        () => R 
    ) : V extends (state: S, action: infer A) => infer R ? (
        (action: A) => R
    ) : never
)

export type HandlerRecord<
    S extends States,
    SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>,
    AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>
> = AutoBuildHandlerRecord<S> & {
    [K in keyof SH]: ReturnHandlers<S, SH[K]>
} & {
    [K in keyof AH]: ReturnHandlers<S, AH[K]>
}



export type CreateStoreReturn<
    S extends States = States,
    SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>,
    AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>
> = {
    useStore: <T extends object>(selector: (state: S) => T) =>  T,
    useHandlers: () => HandlerRecord<S, SH, AH>
}