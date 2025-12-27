import runAction, { Action } from "@/utils/functions/runAction";
import arrayHandlers from "./Handlers/array.handlers";
import boolHandlers from "./Handlers/bool.handlers";
import objectHandlers from "./Handlers/object.handler";

function cookAutoBuildHandlers<S extends Record<string, any>>(states: S, notify: () => void) {

    const defaultStates: S = JSON.parse(JSON.stringify(states));
    
    return Object.fromEntries(
        Object.entries(states).map(([key, val]: [keyof S, S[keyof S]]) => {

            const getState = () => states[key];

            const setState = (newStates: S[keyof S]) => {
                states[key] = newStates;
                notify();
            }

            const handlers = {
                set: (action: Action<typeof val>) => {
                    setState(runAction(action, getState()));
                },

                reset: () => {
                    setState(defaultStates[key]);
                },
                
                ...(
                     Array.isArray(val) ? arrayHandlers(getState, setState)
                    : typeof val === "object" ? objectHandlers(getState, setState)
                    : typeof val === 'boolean' ? boolHandlers(getState, setState)
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