import React, { createContext, ReactNode, useContext, useRef } from "react";
import { ConfigStoreProps, GSH, GAH, UseHandlers } from "../core/configStore/types";
import createStore, { CreateStore } from "./createStore";



export default function createStoreProvider<
    S extends Record<string, any>, 
    SH extends GSH<S> = GSH<S>, 
    AH extends GAH<S> = GAH<S>
>(props: ConfigStoreProps<S, SH, AH>) {    

    const Context = createContext<CreateStore<S, SH, AH> | null>(null);
    
    function Provider({children}: {children: ReactNode}): React.JSX.Element {
        const store = useRef<CreateStore<S, SH, AH> | null>(null);

        if(!store.current) {
            store.current = createStore(props);
        }

        return (
            <Context.Provider value={store.current}>
                {children}
            </Context.Provider>
        )
    }

    
    function useStore<T>(selector: (states: S) => T): T {
        const store = useContext(Context);
        if(!store) throw Error('Store Provider is missing !!');
        return store.useStore(selector);
    }


    function useHandlers(): UseHandlers<S, SH, AH> {
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