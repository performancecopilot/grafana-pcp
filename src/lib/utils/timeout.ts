import { TimeoutError } from '../models/errors/timeout';

export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
        setTimeout(() => {
            reject(new TimeoutError('Request timeout'));
        }, ms);
        try {
            const result = await promise;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}
