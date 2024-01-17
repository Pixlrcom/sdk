import { MutablePromise } from "../promises/MutablePromise";

export class MessageIterator implements AsyncIterator<MessageEvent<any>> {

    private queue: MutablePromise<IteratorResult<MessageEvent<any>>, DOMException>[];
    private done: Promise<IteratorResult<MessageEvent<any>>>[];

    constructor(port: MessagePort) {
        this.queue = [];
        this.done = [];

        port.onmessage = (event) => {
            const out = event.data === 'close' ? 
                { done: true, value: event } :
                { done: false, value: event };

            if (this.queue.length > 0) {
                const [first] = this.queue.splice(0, 1);
                first.resolve(out);
            } else {
                this.done.push(Promise.resolve(out));
            }
        }
    }

    next(...args: [] | [undefined]): Promise<IteratorResult<MessageEvent<any>, any>> {
        if (this.done.length > 0) {
            const [p] = this.done.splice(0, 1);
            return p;
        }

        // We don't have data in the buffer, we have to wait
        const p = new MutablePromise<IteratorResult<MessageEvent<any>>, DOMException>();
        this.queue.push(p)
        return p;
    }

    //@ts-ignore
    [Symbol.asyncIterator]() {
        return this;
    }

}