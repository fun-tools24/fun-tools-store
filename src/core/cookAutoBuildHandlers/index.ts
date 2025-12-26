import runAction, { Action } from "../../Utils/runAction";
import arrayHandlers from "./Handlers/array.handlers";
import boolHandlers from "./Handlers/bool.handlers";
import objectHandlers from "./Handlers/object.handler";

function cookAutoBuildHandlers<S extends Record<string, any>>(states: S, notify: <A>(a?: A) => A) {

    const defaultStates: S = JSON.parse(JSON.stringify(states));
    
    return Object.fromEntries(
        Object.entries(states).map(([key, val]: [keyof S, S[keyof S]]) => {
            const handlers = {
                set: (action: Action<typeof val>) => {
                    states[key] = runAction(action, val);
                    notify();
                },

                reset: () => {
                    states[key] = defaultStates[key];
                    notify();
                },
                
                ...(
                    Array.isArray(val) ? arrayHandlers(val, notify)
                    : typeof val === "object" ? objectHandlers(val, notify)
                    : typeof val === 'boolean' ? boolHandlers(val, notify)
                    : {}
                )
            }
            
            return [key, handlers]
        })
    )
}


type CookAutoBuildHandlers<S extends Record<string, any>> = ReturnType<typeof cookAutoBuildHandlers<S>>

export {
    CookAutoBuildHandlers,
    cookAutoBuildHandlers as default
}