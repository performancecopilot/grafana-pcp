import { TimeoutError } from '../models/errors/errors';

// Use only when you trust HTML source!
const stripHtml = (html: string) => {
    const el = document.createElement('div');
    el.innerHTML = html;
    return el.textContent || el.innerText || '';
};

const timeout = async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
        // This produces uncatchable error for some reason.
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
};

export { timeout, stripHtml };
