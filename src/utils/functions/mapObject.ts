
export default function mapObject<O extends object, R>(obj: O, cb: (val: any) => R) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => (
            [key, cb(val)]
        ))
    ) as { [K in keyof O]: R };
}