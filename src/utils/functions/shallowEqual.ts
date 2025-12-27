export default function shallowEqual(a: any, b: any) {
    if(a === b) return true;
    
    if(typeof a !== 'object' || typeof b !== 'object') return false;

    if(Array.isArray(a) !== Array.isArray(b)) return false;

    const key1 = Object.keys(a);
    const key2 = Object.keys(b);

    if(key1.length !== key2.length) return false;

    for(let key of key1) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
        if (!Object.is(a[key], b[key])) return false;
    }

    return true;
}