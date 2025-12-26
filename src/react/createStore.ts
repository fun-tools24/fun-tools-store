import { useSyncExternalStore } from "react";
import configStore from "../core/configStore";
import { ConfigStoreProps, States } from "../core/types";

export default function createStore<S extends States>(option: ConfigStoreProps<S>) {
    const {handlers, consume, getSnapshot} = configStore(option);

    function useStore<T extends object>(selector: (state: S) => T): T {
        return useSyncExternalStore(
            consume,
            () => getSnapshot(selector),
            () => getSnapshot(selector)
        )
    }

    const useHandlers = () => handlers;

    return {
        useStore,
        useHandlers
    }
}

export type CreateStore<S extends States> = ReturnType<typeof createStore<S>>