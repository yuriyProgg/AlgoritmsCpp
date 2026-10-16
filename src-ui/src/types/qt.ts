export type QtTransport = object;

export interface QtSignal<TArgs extends readonly unknown[]> {
  connect: (callback: (...args: TArgs) => void) => void;
  disconnect: (callback: (...args: TArgs) => void) => void;
}

export interface SorterBackend {
  bubble_sort: () => void;
  selection_sort: () => void;
  insertion_sort: () => void;
  shell_sort: () => void;
  quick_sort: () => void;
  merge_sort: () => void;
  heap_sort: () => void;
  ready_data: QtSignal<readonly [string]>;
}

export interface QtChannel {
  objects: {
    sorter?: SorterBackend;
  };
}

export interface QWebChannelInstance {
  readonly objects: QtChannel["objects"];
}

export interface QWebChannelConstructor {
  new (transport: QtTransport, callback: (channel: QtChannel) => void): QWebChannelInstance;
}

declare global {
  interface Window {
    qt?: {
      webChannelTransport?: QtTransport;
    };
    QWebChannel?: QWebChannelConstructor;
    sorter?: SorterBackend;
  }
}
