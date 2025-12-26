import { useSyncExternalStore } from "react";
import cookAutoBuildHandlers from "./cookAutoBuildHandlers";
import mapObject from "../Utils/mapObject";
import shallowEqual from "../Utils/shallowEqual";
import { 
    AsyncHandler, AsyncHandlerRecord, 
    SyncHandler, SyncHandlerRecord,
    ConfigStoreProps, States, 
} from "./types";



export default function configStore<
    S extends States,
    SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>,
    AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>
>({
    states, syncHandlers, asyncHandlers
}: ConfigStoreProps<S, SH, AH>) {

    
    const handlers = Object.freeze({
        ...mapObject(syncHandlers ?? {}, (val?: any) => {val(); notify()}) as SyncHandlerRecord<S, SH>,
        ...mapObject(asyncHandlers ?? {}, (val?: any) => {val(); notify()}) as AsyncHandlerRecord<S, AH>,
        ...cookAutoBuildHandlers(states, notify),
    })


    const consumers = new Set<() => void>();

    
    function consume(consumer: () => void) {
        consumers.add(consumer);
        return () => consumers.delete(consumer);
    }


    function notify<A>(a?: A): A {
        consumers.forEach(con => con());
        return a as A;
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


    return {
        handlers,
        consume,
        getSnapshot
    }
}