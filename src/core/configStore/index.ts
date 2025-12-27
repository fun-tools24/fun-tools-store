import cookAutoBuildHandlers from "./cookAutoBuildHandlers";
import mapObject from "@/utils/functions/mapObject";
import shallowEqual from "@/utils/functions/shallowEqual";
import { 
    ConfigStoreProps, GAH, GSH, States,
    UseHandlers, 
} from "./types";



export default function configStore<
    S extends States, 
    SH extends GSH<S> = GSH<S>,
    AH extends GAH<S> = GAH<S>
>({
    states, syncHandlers, asyncHandlers
}: ConfigStoreProps<S, SH, AH>) {

    
    const handlers = Object.freeze({
        ...mapObject(syncHandlers ?? {}, (handler: any) => (...args: any[]) => { handler(states, ...args); notify(); }),
        ...mapObject(asyncHandlers ?? {}, (handler: any) => async (...args: any[]) => { await handler(states, ...args); notify(); }),
        ...cookAutoBuildHandlers(states, notify),
    }) as UseHandlers<S, SH, AH>;


    const consumers = new Set<() => void>();

    
    function consume(consumer: () => void) {
        consumers.add(consumer);
        return () => consumers.delete(consumer);
    }


    function notify() {
        consumers.forEach(con => con());
    }


    const snapshotCache = new WeakMap<(state: S) => any, any>();


    function getSnapshot<T>(selector: (state: S) => T): T {
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