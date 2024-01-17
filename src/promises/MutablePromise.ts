/**
 * A simple class that implements Promise but can be resolved/rejected by calling instance members instead of callbacks in the
 * constructor, sometimes useful when the dataflow can't easily be expressed with the default and recommended way of making Promises
 */
export class MutablePromise<T, E = any> implements Promise<T> {
  private promise: Promise<T>;

  // Note in the ignore: they are set in the constructor but
  // Typescript does not understand the execution flow of the Promise constructor where they are set
  //@ts-ignore
  resolve: (data: T) => void;
  //@ts-ignore
  reject: (reason: E) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  // @ts-ignore
  [Symbol.toStringTag]: "[object MutablePromise]";

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): Promise<TResult1> {
    return this.promise.then(onfulfilled, onrejected) as Promise<TResult1>;
  }

  catch<TResult>(
    onrejected?: (reason: any) => TResult | PromiseLike<TResult>
  ): Promise<TResult> {
    return this.promise.catch(onrejected) as Promise<TResult>;
  }

  finally(onfinally: () => void): Promise<T> {
    return this.promise.finally(onfinally);
  }
}
