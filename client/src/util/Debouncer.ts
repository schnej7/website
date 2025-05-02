type Func<T extends any[]> = (...args: T) => any;

export default class Debouncer<T extends any[]>{
  timeout: undefined | ReturnType<typeof setTimeout>;

  func: Func<T>;

  timeoutMs: number;

  lastArgs: T | undefined;

  constructor(func: Func<T>, timeoutMs: number) {
    this.func = func;
    this.timeoutMs = timeoutMs;
  }

  debounce(...args: T) {
    this.lastArgs = args;
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.timeout = undefined;
        if (this.lastArgs) {
          this.func(...this.lastArgs);
        }
      }, this.timeoutMs);
      this.func(...args);
    }
  }
}
