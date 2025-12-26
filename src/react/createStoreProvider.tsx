import React, { createContext, ReactNode, useContext, useRef } from "react";
import { ConfigStoreProps, UseHandlers } from "../core/types";
import createStore, { CreateStore } from "./createStore";



export default function createStoreProvider<S extends Record<string, any>>(props: ConfigStoreProps<S>) {    

    const Context = createContext<CreateStore<S> | null>(null);
    
    function Provider({children}: {children: ReactNode}): React.JSX.Element {
        const store = useRef<CreateStore<S> | null>(null);

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


    function useHandlers(): UseHandlers<S> {
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


export type CreateStoreProvider<S extends Record<string, any>> = ReturnType<typeof createStoreProvider<S>>