import type { QtChannel, SorterBackend } from "../types/qt.ts";

export interface SorterHandle {
  sorter: SorterBackend | null;
  getResponse: () => string;
}

export function getSorter(): SorterHandle {
  let sorter: SorterBackend | null = null;
  let response = "";

  const transport = window.qt?.webChannelTransport;
  const Factory = window.QWebChannel;
  if (transport !== undefined && Factory !== undefined) {
    new Factory(transport, (channel: QtChannel) => {
      const backend: SorterBackend | undefined = channel.objects.sorter;
      if (backend === undefined) return;
      sorter = backend;
      window.sorter = backend;
      backend.ready_data.connect((data: string) => {
        response = data;
      });
    });
  }
  return { sorter, getResponse: () => response };
}
