// typescript decorator which makes sure that this function
// is called only once at a time
// subsequent calls return the promise of the first call
export function synchronized(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method = descriptor.value;

    if (!target.locks)
        target.locks = {};

    descriptor.value = function() {
        if (target.locks[propertyKey])
            return target.locks[propertyKey];
        target.locks[propertyKey] = method.apply(this, arguments);
        return target.locks[propertyKey].then((result: any) => {
            target.locks[propertyKey] = null;
            return result;
        });
    }
}
