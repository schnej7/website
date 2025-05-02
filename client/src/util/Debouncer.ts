type Func<T extends any[]> = (...args: T) => any;

export default class Debouncer<T extends any[]>{
  timeout: undefined | ReturnType<typeof setTimeout>;

  func: Func<T>;

  timeoutMs: number;

  constructor(func: Func<T>, timeoutMs: number) {
    this.func = func;
    this.timeoutMs = timeoutMs;
  }

  debounce(...args: T) {
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.timeout = undefined;
      }, this.timeoutMs);
      this.func(...args);
    }
  }
}
