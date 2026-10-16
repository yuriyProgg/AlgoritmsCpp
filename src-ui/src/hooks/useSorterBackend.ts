import { useEffect, useRef, useState } from "react";
import type { QtChannel, QWebChannelConstructor, QtTransport, SorterBackend } from "../types/qt.ts";
import type { Order, ParseResult, SortMethodName } from "../types/sort.ts";
import { parseOrdersPayload } from "../types/sort.ts";

export interface SorterBackendApi {
  backendReady: boolean;
  backendError: string | null;
  loadingAlgo: string | null;
  runMethod: (method: SortMethodName, algoId: string, fallback: () => void) => void;
}

export function useSorterBackend(onOrders: (orders: Order[]) => void): SorterBackendApi {
  const [backendReady, setBackendReady] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [loadingAlgo, setLoadingAlgo] = useState<string | null>(null);
  const backendRef = useRef<SorterBackend | null>(null);
  const readyHandlerRef = useRef<((payload: string) => void) | null>(null);
  const onOrdersRef = useRef(onOrders);
  onOrdersRef.current = onOrders;

  useEffect(() => {
    let mounted = true;
    const timer: number = window.setTimeout(() => {
      try {
        const transport: QtTransport | undefined = window.qt?.webChannelTransport;
        const Factory: QWebChannelConstructor | undefined = window.QWebChannel;
        if (transport !== undefined && Factory !== undefined) {
          new Factory(transport, (channel: QtChannel) => {
            const backend: SorterBackend | undefined = channel.objects.sorter;
            if (mounted && backend !== undefined) {
              backendRef.current = backend;
              window.sorter = backend;
              const onReady = (payload: string): void => {
                const result: ParseResult = parseOrdersPayload(payload);
                if (!mounted) return;
                if (result.ok) {
                  onOrdersRef.current(result.orders);
                } else {
                  setBackendError(result.error);
                }
                setLoadingAlgo(null);
              };
              readyHandlerRef.current = onReady;
              backend.ready_data.connect(onReady);
              setBackendReady(true);
              setBackendError(null);
            }
          });
        }
      } catch (error: unknown) {
        if (mounted) {
          setBackendError(error instanceof Error ? error.message : "Ошибка инициализации моста Qt");
        }
      }
    }, 200);
    return () => {
      mounted = false;
      window.clearTimeout(timer);
      const backend: SorterBackend | null = backendRef.current;
      const handler = readyHandlerRef.current;
      if (backend !== null && handler !== null) {
        try {
          backend.ready_data.disconnect(handler);
        } catch {
          /* мост уже недоступен — игнорируем */
        }
      }
      backendRef.current = null;
    };
  }, []);

  const runMethod = (method: SortMethodName, algoId: string, fallback: () => void): void => {
    setLoadingAlgo(algoId);
    const backend: SorterBackend | null = backendRef.current;
    if (backend === null) {
      window.setTimeout(() => {
        fallback();
        setLoadingAlgo(null);
      }, 300);
      return;
    }
    try {
      backend[method]();
    } catch (error: unknown) {
      setBackendError(error instanceof Error ? error.message : "Вызов C++ не удался");
      setLoadingAlgo(null);
    }
  };

  return { backendReady, backendError, loadingAlgo, runMethod };
}
