import { CookAutoBuildHandlers } from "./cookAutoBuildHandlers";


export type States = Record<string, any>;


export type ConfigStoreProps<
    S extends States,
    SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>,
    AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>
> = {
    states: S,
    syncHandlers?: SH,
    asyncHandlers?: AH
}



type Handler<S, V> = (
    V extends (state: S) => infer R ? (
        (state: S) => R
    ) : V extends (state: S, action: infer A) => infer R ? (
        (state: S, action: A) => R
    ) : never
) 

export type SyncHandler<S> = Handler<S, (state: S, action: any) => any>;

export type AsyncHandler<S> = Handler<S, (state: S, action: any) => Promise<any>>;



type CookedHandler<S, V> = (
    V extends (state: S) => infer R ? (
        () => R
    ) : V extends (states: S, action: infer A) => infer R ? (
        (action: A) => R
    ) : never
)

export type SyncHandlerRecord<S, SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>> = {
    [K in keyof SH]: CookedHandler<S, SH[K]>
};

export type AsyncHandlerRecord<S, AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>> = {
    [K in keyof AH]: CookedHandler<S, AH[K]>
};



export type UseHandlers<S extends States> = (
    CookAutoBuildHandlers<S> & SyncHandlerRecord<S> & AsyncHandlerRecord<S>
)

