// Polyfill for CloseEvent in Node.js test environment
if (typeof CloseEvent === 'undefined') {
  global.CloseEvent = class CloseEvent extends Event {
    code: number;
    reason: string;
    wasClean: boolean;

    constructor(type: string, eventInitDict?: { code?: number; reason?: string; wasClean?: boolean }) {
      super(type);
      this.code = eventInitDict?.code ?? 0;
      this.reason = eventInitDict?.reason ?? '';
      this.wasClean = eventInitDict?.wasClean ?? false;
    }
  } as any;
}

type MessageHandler = (data: string) => void;
type ErrorHandler = (event: Event) => void;
type CloseHandler = (event: CloseEvent) => void;
type OpenHandler = () => void;

export class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  public readyState: number = MockWebSocket.CONNECTING;
  public url: string;
  public shouldThrowOnSend: boolean = false;

  private messageHandlers: MessageHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private closeHandlers: CloseHandler[] = [];
  private openHandlers: OpenHandler[] = [];

  constructor(url: string) {
    this.url = url;
  }

  addEventListener(event: string, handler: any): void {
    switch (event) {
      case 'message':
        this.messageHandlers.push(handler);
        break;
      case 'error':
        this.errorHandlers.push(handler);
        break;
      case 'close':
        this.closeHandlers.push(handler);
        break;
      case 'open':
        this.openHandlers.push(handler);
        break;
    }
  }

  removeEventListener(event: string, handler: any): void {
    switch (event) {
      case 'message':
        this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
        break;
      case 'error':
        this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
        break;
      case 'close':
        this.closeHandlers = this.closeHandlers.filter((h) => h !== handler);
        break;
      case 'open':
        this.openHandlers = this.openHandlers.filter((h) => h !== handler);
        break;
    }
  }

  send(_data: string): void {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    if (this.shouldThrowOnSend) {
      throw new Error('Network error during send');
    }
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSED;
  }

  // Test utilities
  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.openHandlers.forEach((handler) => handler());
  }

  simulateError(_error?: Error): void {
    const event = new Event('error');
    this.errorHandlers.forEach((handler) => handler(event));
  }

  simulateClose(code: number = 1000, reason: string = '', wasClean: boolean = true): void {
    this.readyState = MockWebSocket.CLOSED;
    const event = new CloseEvent('close', { code, reason, wasClean });
    this.closeHandlers.forEach((handler) => handler(event));
  }

  simulateMessage(data: any): void {
    const event = new MessageEvent('message', { data: JSON.stringify(data) }) as any;
    this.messageHandlers.forEach((handler) => handler(event));
  }
}

export function mockWebSocket(): {
  mockWs: typeof MockWebSocket;
  getLastInstance: () => MockWebSocket | undefined;
  getAllInstances: () => MockWebSocket[];
  clearInstances: () => void;
} {
  const instances: MockWebSocket[] = [];

  const mockWs = class extends MockWebSocket {
    constructor(url: string) {
      super(url);
      instances.push(this);
    }
  } as any;

  mockWs.CONNECTING = MockWebSocket.CONNECTING;
  mockWs.OPEN = MockWebSocket.OPEN;
  mockWs.CLOSING = MockWebSocket.CLOSING;
  mockWs.CLOSED = MockWebSocket.CLOSED;

  return {
    mockWs,
    getLastInstance: () => instances[instances.length - 1],
    getAllInstances: () => instances,
    clearInstances: () => {
      instances.length = 0;
    },
  };
}

export function createJsonRpcResponse(id: number, result: any) {
  return {
    jsonrpc: '2.0',
    id,
    result,
  };
}

export function createJsonRpcError(id: number, code: number, message: string) {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
    },
  };
}

export function createSubscriptionMessage(subscriptionId: number, result: any) {
  return {
    jsonrpc: '2.0',
    params: {
      subscription: subscriptionId,
      result,
    },
  };
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Helper to create a connected provider for tests
 * Returns provider and the mock WebSocket instance
 */
export async function createConnectedProvider(
  mock: ReturnType<typeof mockWebSocket>,
  options: any = {},
): Promise<{ provider: any; ws: MockWebSocket }> {
  const { WsVaraEthProvider } = await import('../../src/provider/ws.js');

  const provider = new WsVaraEthProvider('ws://localhost:9944', {
    autoConnect: false,
    ...options,
  });

  const connectPromise = provider.connect();
  const ws = mock.getLastInstance()!;
  ws.simulateOpen();
  await connectPromise;
  await delay(10);

  return { provider, ws };
}
