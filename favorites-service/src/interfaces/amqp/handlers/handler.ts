export interface Message<T> {
  content: T;
}

export interface Handler {
  handle: (message: Message<any>) => Promise<void>;
}
