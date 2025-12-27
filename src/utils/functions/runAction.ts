export type Action<T> = ((val: T) => T) | T;

export default function runAction<T>(action: Action<T>, val: T): T {
    if(typeof action === 'function') {
        return (action as (val: T) => T)(val);
    }

    return action;
}