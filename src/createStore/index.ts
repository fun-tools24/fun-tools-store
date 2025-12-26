import { useSyncExternalStore } from "react";
import { cookAutoBuildHandlers, shallowEqual } from "./utils";
import { 
    AsyncHandler, CreateStoreContextProps, 
    CreateStoreReturn, 
    HandlerRecord, States, SyncHandler 
} from "./types";



export default function createStore<
    S extends States,
    SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>,
    AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>
>({
    states, syncHandlers, asyncHandlers
}: CreateStoreContextProps<S, SH, AH>): CreateStoreReturn<S, SH, AH> {

    const allHandlers: HandlerRecord<S, SH, AH> = Object.freeze(
        Object.fromEntries([
            ...Object.entries(syncHandlers ?? {}).map(([key, cb]) => [
                key, (action?: any) => {cb(states, action); notify();}
            ]),
            ...Object.entries(asyncHandlers ?? {}).map(([key, cb]) => [
                key, async (action?: any) => {await cb(states, action); notify();}
            ]),
            ...Object.entries(cookAutoBuildHandlers(states, notify))
        ])
    ) as HandlerRecord<S, SH, AH>


    const consumers = new Set<() => void>();

    
    function consume(consumer: () => void) {
        consumers.add(consumer);
        return () => consumers.delete(consumer);
    }


    function notify() {
        consumers.forEach(con => con());
    }


    const snapshotCache = new WeakMap<(state: S) => object, object>();


    function getSnapshot<T extends object>(selector: (state: S) => T): T {
        const newSnapshot = selector(states);
        const cachedSnapshot = snapshotCache.get(selector);

        if(cachedSnapshot && shallowEqual(newSnapshot, cachedSnapshot)) {
            return cachedSnapshot as T;
        }
            
        snapshotCache.set(selector, newSnapshot);
        return Object.freeze(newSnapshot);
    }
    
    
    function useStore<T extends object>(selector: (state: S) => T): T {
        return useSyncExternalStore(
            consume,
            () => getSnapshot(selector),
            () => getSnapshot(selector)
        )
    }


    function useHandlers(): HandlerRecord<S, SH, AH> {
        return allHandlers;
    }


    return {
        useStore,
        useHandlers
    }
}