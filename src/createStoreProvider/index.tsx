import React, { createContext, ReactNode, useContext, useRef } from "react";
import createStore from "../createStore";
import { AsyncHandler, CreateStoreContextProps, CreateStoreReturn, HandlerRecord, States, SyncHandler } from "../createStore/types";



export default function createStoreProvider<
    S extends States,
    SH extends Record<string, SyncHandler<S>> = Record<string, SyncHandler<S>>,
    AH extends Record<string, AsyncHandler<S>> = Record<string, AsyncHandler<S>>
>(props: CreateStoreContextProps<S, SH, AH>) {    

    const Context = createContext<CreateStoreReturn<S, SH, AH> | null>(null);
    
    function Provider({children}: {children: ReactNode}): React.JSX.Element {
        const store = useRef<CreateStoreReturn<S, SH, AH> | null>(null);

        if(!store.current) {
            store.current = createStore(props);
        }

        return (
            <Context.Provider value={store.current}>
                {children}
            </Context.Provider>
        )
    }

    
    function useStore<T extends object>(selector: (states: S) => T): T {
        const store = useContext(Context);
        if(!store) throw Error('Store Provider is missing !!');
        return store.useStore<T>(selector);
    }


    function useHandlers(): HandlerRecord<S, SH, AH> {
        const store = useContext(Context);
        if(!store) throw Error('Store Provider is missing !!');
        return store.useHandlers();
    }


    return {
        Provider,
        useStore,
        useHandlers
    } 
}