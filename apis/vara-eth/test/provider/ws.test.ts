import {
  mockWebSocket,
  createJsonRpcResponse,
  createJsonRpcError,
  createSubscriptionMessage,
  delay,
  createConnectedProvider,
} from './ws.mock.js';
import { WsVaraEthProvider } from '../../src/provider/ws.js';

const TEST_WS_URL = 'ws://localhost:9944';
const TEST_WS_URL_CUSTOM = 'ws://example.com:8080';
const DEFAULT_WS_URL = 'ws://127.0.0.1:9944';

const TEST_METHODS = {
  TEST: 'test_method',
  METHOD1: 'method1',
  METHOD2: 'method2',
  METHOD3: 'method3',
  SUBSCRIBE: 'test_subscribe',
} as const;

const TEST_ERRORS = {
  DISCONNECTED_SEND: 'Cannot send request: WebSocket is disconnected. Call connect() first.',
  DISCONNECTED_SUBSCRIBE: 'Cannot subscribe: WebSocket is disconnected. Call connect() first.',
  FAILED_SEND: 'Cannot send request: WebSocket connection failed. Call connect() to retry.',
  FAILED_SUBSCRIBE: 'Cannot subscribe: WebSocket connection failed. Call connect() to retry.',
  MANUALLY_CLOSED: 'Connection was manually closed',
} as const;

let mock: ReturnType<typeof mockWebSocket>;
let originalWebSocket: typeof global.WebSocket;

beforeEach(() => {
  mock = mockWebSocket();
  originalWebSocket = global.WebSocket;
  (global as any).WebSocket = mock.mockWs;
});

afterEach(() => {
  global.WebSocket = originalWebSocket;
  mock.clearInstances();
});

describe('WsVaraEthProvider - Connection Management', () => {
  describe('Constructor & Auto-connect', () => {
    test('should not auto-connect when autoConnect is false', () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      expect(mock.getAllInstances()).toHaveLength(0);
      expect(provider.isConnected).toBe(false);
      expect(provider.connectionState).toBe('disconnected');
    });

    test('should auto-connect when autoConnect is true (default)', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL);

      expect(mock.getAllInstances()).toHaveLength(1);
      expect(provider.connectionState).toBe('connecting');

      const ws = mock.getLastInstance()!;
      ws.simulateOpen();
      await delay(10);

      expect(provider.isConnected).toBe(true);
      expect(provider.connectionState).toBe('connected');

      await provider.disconnect();
    });

    test('should use default URL and apply custom options', () => {
      const provider = new WsVaraEthProvider(undefined, {
        autoConnect: false,
        reconnectAttempts: 5,
        reconnectDelay: 2000,
        requestTimeout: 60000,
      });

      expect(provider.url).toBe(DEFAULT_WS_URL);
      expect(provider.connectionState).toBe('disconnected');
    });
  });

  describe('connect() method', () => {
    test('should establish WebSocket connection successfully', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      const connectPromise = provider.connect();
      expect(provider.connectionState).toBe('connecting');

      const ws = mock.getLastInstance()!;
      ws.simulateOpen();

      await connectPromise;

      expect(provider.isConnected).toBe(true);
      expect(provider.connectionState).toBe('connected');

      await provider.disconnect();
    });

    test('should reuse existing connection promise when already connecting', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      const promise1 = provider.connect();
      const promise2 = provider.connect();

      expect(mock.getAllInstances()).toHaveLength(1);

      const ws = mock.getLastInstance()!;
      ws.simulateOpen();

      await Promise.all([promise1, promise2]);

      expect(mock.getAllInstances()).toHaveLength(1);

      await provider.disconnect();
    });

    test('should return immediately when already connected', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      const connectPromise = provider.connect();
      const ws = mock.getLastInstance()!;
      ws.simulateOpen();
      await connectPromise;
      await delay(10);

      const beforeConnect = Date.now();
      await provider.connect();
      const afterConnect = Date.now();

      expect(afterConnect - beforeConnect).toBeLessThan(50);
      expect(provider.isConnected).toBe(true);

      await provider.disconnect();
    });

    test('should retry on failure up to reconnectAttempts times', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, {
        autoConnect: false,
        reconnectAttempts: 3,
        reconnectDelay: 50,
      });

      const connectPromise = provider.connect();

      // Fail first two attempts
      for (let i = 0; i < 2; i++) {
        await delay(10);
        const ws = mock.getLastInstance()!;
        ws.simulateError();
        await delay(60);
      }

      // Succeed third attempt
      const ws = mock.getLastInstance()!;
      ws.simulateOpen();

      await connectPromise;

      expect(provider.isConnected).toBe(true);
      expect(mock.getAllInstances()).toHaveLength(3);

      await provider.disconnect();
    });

    test('should fail after exhausting retry attempts', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, {
        autoConnect: false,
        reconnectAttempts: 2,
        reconnectDelay: 50,
      });

      const connectPromise = provider.connect();

      // Fail first attempt
      await delay(10);
      let ws = mock.getLastInstance()!;
      ws.simulateError();
      await delay(60);

      // Fail second attempt (final)
      await delay(10);
      ws = mock.getLastInstance()!;
      ws.simulateError();

      await expect(connectPromise).rejects.toThrow(
        'Failed to connect after 2 attempts. Check your network connection and server availability.',
      );
      expect(provider.connectionState).toBe('failed');
    });

    test('should emit correct events during connection', async () => {
      const events: string[] = [];
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      provider.on('connecting', (event) => events.push(`connecting:${event.attempt}`));
      provider.on('connected', () => events.push('connected'));

      const connectPromise = provider.connect();
      const ws = mock.getLastInstance()!;
      ws.simulateOpen();

      await connectPromise;

      expect(events).toEqual(['connecting:1', 'connected']);

      await provider.disconnect();
    });

    test('should respect reconnectDelay between retries', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, {
        autoConnect: false,
        reconnectAttempts: 2,
        reconnectDelay: 100,
      });

      const connectPromise = provider.connect();

      const ws1 = mock.getLastInstance()!;
      ws1.simulateError();

      await delay(50);
      expect(mock.getAllInstances()).toHaveLength(1); // No retry yet

      await delay(60);
      expect(mock.getAllInstances()).toHaveLength(2); // Retry happened

      const ws2 = mock.getLastInstance()!;
      ws2.simulateOpen();

      await connectPromise;
      await provider.disconnect();
    });
  });

  describe('disconnect() method', () => {
    test('should close connection and clear pending requests', async () => {
      const { provider, ws } = await createConnectedProvider(mock);

      const requestPromise = provider.send(TEST_METHODS.TEST, []);

      await provider.disconnect();

      expect(ws.readyState).toBe(3); // CLOSED
      expect(provider.connectionState).toBe('disconnected');
      expect(provider.isConnected).toBe(false);
      await expect(requestPromise).rejects.toThrow(TEST_ERRORS.MANUALLY_CLOSED);
    });

    test('should clear request queue and subscriptions', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      const connectPromise = provider.connect();

      // Queue request while connecting
      const queuedRequest = provider.send(TEST_METHODS.TEST, []);

      const ws = mock.getLastInstance()!;
      ws.simulateOpen();
      await connectPromise;
      await delay(10);

      const callback = jest.fn();
      await provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], callback);

      await provider.disconnect();

      await expect(queuedRequest).rejects.toThrow(TEST_ERRORS.MANUALLY_CLOSED);
      expect(callback).toHaveBeenCalledWith(expect.any(Error), null);
    });
  });
});

describe('WsVaraEthProvider - State Management', () => {
  test('should transition through connection states correctly', async () => {
    const states: string[] = [];
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    states.push(provider.connectionState);

    const connectPromise = provider.connect();
    states.push(provider.connectionState);

    const ws = mock.getLastInstance()!;
    ws.simulateOpen();
    await connectPromise;
    states.push(provider.connectionState);

    await provider.disconnect();
    states.push(provider.connectionState);

    expect(states).toEqual(['disconnected', 'connecting', 'connected', 'disconnected']);
  });

  test('should transition to failed state on connection error', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, {
      autoConnect: false,
      reconnectAttempts: 1,
    });

    const connectPromise = provider.connect();

    const ws = mock.getLastInstance()!;
    ws.simulateError();

    await expect(connectPromise).rejects.toThrow();
    expect(provider.connectionState).toBe('failed');
  });

  test('should track state correctly through reconnection attempts', async () => {
    const states: string[] = [];
    const provider = new WsVaraEthProvider(TEST_WS_URL, {
      autoConnect: false,
      reconnectAttempts: 2,
      reconnectDelay: 50,
    });

    provider.on('connecting', () => states.push('connecting'));
    provider.on('error', () => states.push('failed'));
    provider.on('connected', () => states.push('connected'));

    const connectPromise = provider.connect();

    // First attempt fails
    await delay(10);
    let ws = mock.getLastInstance()!;
    ws.simulateError();

    await delay(60);

    // Second attempt succeeds
    ws = mock.getLastInstance()!;
    ws.simulateOpen();

    await connectPromise;

    expect(states).toEqual(['connecting', 'failed', 'connecting', 'connected']);

    await provider.disconnect();
  });

  test('should expose correct state via getters', () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL_CUSTOM, { autoConnect: false });

    expect(provider.url).toBe(TEST_WS_URL_CUSTOM);
    expect(provider.connectionState).toBe('disconnected');
    expect(provider.isConnected).toBe(false);
  });
});

describe('WsVaraEthProvider - Request Handling', () => {
  describe('send() method', () => {
    test('should send request successfully when connected', async () => {
      const { provider, ws } = await createConnectedProvider(mock);

      const requestPromise = provider.send(TEST_METHODS.TEST, ['param1', 'param2']);

      ws.simulateMessage(createJsonRpcResponse(1, { data: 'test_result' }));

      const result = await requestPromise;
      expect(result).toEqual({ data: 'test_result' });

      await provider.disconnect();
    });

    test('should queue request when connecting and execute after connected', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      const connectPromise = provider.connect();
      const requestPromise = provider.send(TEST_METHODS.TEST, ['param1']);

      const ws = mock.getLastInstance()!;
      ws.simulateOpen();
      await connectPromise;
      await delay(10);

      ws.simulateMessage(createJsonRpcResponse(1, { result: 'queued_result' }));

      const result = await requestPromise;
      expect(result).toEqual({ result: 'queued_result' });

      await provider.disconnect();
    });

    test.each([
      ['disconnected', TEST_ERRORS.DISCONNECTED_SEND],
      ['failed', TEST_ERRORS.FAILED_SEND],
    ])('should reject requests when connection state is %s', async (_, expectedError) => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, {
        autoConnect: false,
        reconnectAttempts: 1,
      });

      if (expectedError.includes('failed')) {
        const connectPromise = provider.connect();
        const ws = mock.getLastInstance()!;
        ws.simulateError();
        await expect(connectPromise).rejects.toThrow();
      }

      const requestPromise = provider.send(TEST_METHODS.TEST, []);
      await expect(requestPromise).rejects.toThrow(expectedError);
    });

    test('should handle JSON-RPC responses and errors', async () => {
      const { provider, ws } = await createConnectedProvider(mock);

      const successRequest = provider.send(TEST_METHODS.TEST, []);
      ws.simulateMessage(createJsonRpcResponse(1, { success: true, value: 42 }));
      await expect(successRequest).resolves.toEqual({ success: true, value: 42 });

      const errorRequest = provider.send(TEST_METHODS.TEST, []);
      ws.simulateMessage(createJsonRpcError(2, -32600, 'Invalid Request'));
      await expect(errorRequest).rejects.toThrow('Invalid Request');

      await provider.disconnect();
    });

    test.each([
      [100, 100, 'default timeout'],
      [50, 50, 'custom timeout option'],
      [0, 200, 'disabled timeout (0)'],
      [-1, 200, 'disabled timeout (negative)'],
    ])('should handle timeout: %ims (%s)', async (timeout, waitTime, _description) => {
      const { provider, ws } = await createConnectedProvider(mock, {
        requestTimeout: timeout === 100 ? timeout : 1000,
      });

      const options = timeout === 100 ? {} : { timeout };
      const requestPromise = provider.send(TEST_METHODS.TEST, [], options);

      if (timeout > 0) {
        await expect(requestPromise).rejects.toThrow(`Request timed out after ${timeout}ms`);
      } else {
        await delay(waitTime);
        ws.simulateMessage(createJsonRpcResponse(1, 'delayed_result'));
        await expect(requestPromise).resolves.toBe('delayed_result');
      }

      await provider.disconnect();
    });

    test('should handle multiple concurrent requests', async () => {
      const { provider, ws } = await createConnectedProvider(mock);

      const request1 = provider.send(TEST_METHODS.METHOD1, []);
      const request2 = provider.send(TEST_METHODS.METHOD2, []);
      const request3 = provider.send(TEST_METHODS.METHOD3, []);

      ws.simulateMessage(createJsonRpcResponse(1, 'result1'));
      ws.simulateMessage(createJsonRpcResponse(2, 'result2'));
      ws.simulateMessage(createJsonRpcResponse(3, 'result3'));

      const results = await Promise.all([request1, request2, request3]);
      expect(results).toEqual(['result1', 'result2', 'result3']);

      await provider.disconnect();
    });

    test('should convert snake_case response to camelCase', async () => {
      const { provider, ws } = await createConnectedProvider(mock);

      const requestPromise = provider.send(TEST_METHODS.TEST, []);

      ws.simulateMessage(
        createJsonRpcResponse(1, {
          snake_case_field: 'value',
          nested_object: {
            another_snake_case: 'nested_value',
          },
        }),
      );

      const result = await requestPromise;
      expect(result).toEqual({
        snakeCaseField: 'value',
        nestedObject: {
          anotherSnakeCase: 'nested_value',
        },
      });

      await provider.disconnect();
    });
  });

  describe('Request Queue', () => {
    test('should process queued requests in order after connection', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      const connectPromise = provider.connect();

      const results: number[] = [];
      const request1 = provider.send(TEST_METHODS.METHOD1, []).then(() => results.push(1));
      const request2 = provider.send(TEST_METHODS.METHOD2, []).then(() => results.push(2));
      const request3 = provider.send(TEST_METHODS.METHOD3, []).then(() => results.push(3));

      const ws = mock.getLastInstance()!;
      ws.simulateOpen();
      await connectPromise;
      await delay(10);

      ws.simulateMessage(createJsonRpcResponse(1, 'result1'));
      ws.simulateMessage(createJsonRpcResponse(2, 'result2'));
      ws.simulateMessage(createJsonRpcResponse(3, 'result3'));

      await Promise.all([request1, request2, request3]);

      expect(results).toEqual([1, 2, 3]);

      await provider.disconnect();
    });

    test('should clear queue on disconnect with proper errors', async () => {
      const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

      provider.connect();

      const request1 = provider.send(TEST_METHODS.METHOD1, []);
      const request2 = provider.send(TEST_METHODS.METHOD2, []);

      await provider.disconnect();

      await expect(request1).rejects.toThrow(TEST_ERRORS.MANUALLY_CLOSED);
      await expect(request2).rejects.toThrow(TEST_ERRORS.MANUALLY_CLOSED);
    });
  });
});

describe('WsVaraEthProvider - Subscription Handling', () => {
  test('should create and handle subscription when connected', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    const callback = jest.fn();
    const unsubscribe = await provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', ['param'], callback);

    // First message initializes subscription (returns subscription ID)
    ws.simulateMessage(createJsonRpcResponse(1, 101));
    await delay(10);

    // Subsequent messages are subscription updates
    ws.simulateMessage(createSubscriptionMessage(101, { event: 'data1' }));
    ws.simulateMessage(createSubscriptionMessage(101, { event: 'data2' }));

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(null, { event: 'data1' });
    expect(callback).toHaveBeenCalledWith(null, { event: 'data2' });

    unsubscribe();
    await provider.disconnect();
  });

  test('should queue subscription when connecting', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    const connectPromise = provider.connect();

    const callback = jest.fn();
    const subscribePromise = provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], callback);

    const ws = mock.getLastInstance()!;
    ws.simulateOpen();
    await connectPromise;

    await subscribePromise;
    await delay(10);

    ws.simulateMessage(createJsonRpcResponse(1, 102));
    await delay(10);

    ws.simulateMessage(createSubscriptionMessage(102, { event: 'queued_data' }));

    expect(callback).toHaveBeenCalledWith(null, { event: 'queued_data' });

    await provider.disconnect();
  });

  test.each([
    ['disconnected', TEST_ERRORS.DISCONNECTED_SUBSCRIBE],
    ['failed', TEST_ERRORS.FAILED_SUBSCRIBE],
  ])('should reject subscriptions when state is %s', async (_, expectedError) => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, {
      autoConnect: false,
      reconnectAttempts: 1,
    });

    if (expectedError.includes('failed')) {
      const connectPromise = provider.connect();
      const ws = mock.getLastInstance()!;
      ws.simulateError();
      await expect(connectPromise).rejects.toThrow();
    }

    const callback = jest.fn();
    await expect(provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], callback)).rejects.toThrow(
      expectedError,
    );
  });

  test('should invoke callback with camelCase data and handle errors', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    const callback = jest.fn();
    await provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], callback);

    ws.simulateMessage(createJsonRpcResponse(1, 103));
    await delay(10);

    // Test camelCase conversion
    ws.simulateMessage(
      createSubscriptionMessage(103, {
        snake_case_field: 'value',
        nested_data: { inner_field: 'inner_value' },
      }),
    );

    expect(callback).toHaveBeenCalledWith(null, {
      snakeCaseField: 'value',
      nestedData: { innerField: 'inner_value' },
    });

    // Test error handling - error should be sent to subscription ID (103), not request ID (1)
    ws.simulateMessage(createJsonRpcError(103, -32000, 'Subscription error'));

    expect(callback).toHaveBeenCalledWith(expect.any(Error), null);
    expect(callback.mock.calls[1][0].message).toBe('RpcError(-32000): Subscription error');

    await provider.disconnect();
  });

  test('unsubscribe function should stop receiving updates', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const unsubscribe1 = await provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], callback1);
    await provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], callback2);

    // First message initializes subscriptions
    ws.simulateMessage(createJsonRpcResponse(1, 104));
    ws.simulateMessage(createJsonRpcResponse(2, 105));
    await delay(10);

    // Send updates to both subscriptions
    ws.simulateMessage(createSubscriptionMessage(104, { event: 'data1' }));
    ws.simulateMessage(createSubscriptionMessage(105, { event: 'data2' }));

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    unsubscribe1();

    // Send more updates - only callback2 should receive them
    ws.simulateMessage(createSubscriptionMessage(104, { event: 'data3' }));
    ws.simulateMessage(createSubscriptionMessage(105, { event: 'data4' }));

    expect(callback1).toHaveBeenCalledTimes(1); // Still 1
    expect(callback2).toHaveBeenCalledTimes(2); // Now 2

    await provider.disconnect();
  });
});

describe('WsVaraEthProvider - Event System', () => {
  test('should register and trigger event listeners', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    const listener1 = jest.fn();
    const listener2 = jest.fn();

    provider.on('connected', listener1);
    provider.on('connected', listener2);

    const connectPromise = provider.connect();
    const ws = mock.getLastInstance()!;
    ws.simulateOpen();
    await connectPromise;
    await delay(10);

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'connected',
        state: 'connected',
      }),
    );

    await provider.disconnect();
  });

  test('should remove specific listener or all listeners', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();

    provider.on('connected', listener1);
    provider.on('connected', listener2);
    provider.on('disconnected', listener3);

    provider.off('connected', listener1);

    const connectPromise = provider.connect();
    const ws = mock.getLastInstance()!;
    ws.simulateOpen();
    await connectPromise;
    await delay(10);

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).toHaveBeenCalledTimes(1);

    provider.off('disconnected');

    await provider.disconnect();

    expect(listener3).not.toHaveBeenCalled();
  });

  test('should emit correct events with proper payloads', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, {
      autoConnect: false,
      reconnectAttempts: 2,
      reconnectDelay: 50,
    });

    const connectingListener = jest.fn();
    const connectedListener = jest.fn();
    const disconnectedListener = jest.fn();
    const errorListener = jest.fn();
    const retryListener = jest.fn();

    provider.on('connecting', connectingListener);
    provider.on('connected', connectedListener);
    provider.on('disconnected', disconnectedListener);
    provider.on('error', errorListener);
    provider.on('retry', retryListener);

    // Test connecting event
    const connectPromise = provider.connect();
    await delay(10);

    expect(connectingListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'connecting',
        attempt: 1,
        state: 'connecting',
      }),
    );

    // Fail first attempt to test error and retry events
    let ws = mock.getLastInstance()!;
    ws.simulateError();
    await delay(10);

    expect(errorListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        error: expect.any(Error),
        attempt: 1,
        state: 'failed',
      }),
    );

    expect(retryListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'retry',
        attempt: 2,
        state: 'failed',
        details: expect.objectContaining({ delay: 50 }),
      }),
    );

    await delay(60);

    // Succeed second attempt to test connected event
    ws = mock.getLastInstance()!;
    ws.simulateOpen();
    await connectPromise;

    expect(connectedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'connected',
        state: 'connected',
        attempt: 2,
        details: expect.objectContaining({
          connectionDuration: expect.any(Number),
        }),
      }),
    );

    // Test disconnected event
    ws.simulateClose(1006, 'Connection lost', false);
    await delay(10);

    expect(disconnectedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'disconnected',
        error: expect.any(Error),
        state: 'disconnected',
        details: expect.objectContaining({
          code: 1006,
          reason: 'Connection lost',
          wasClean: false,
        }),
      }),
    );
  });
});

describe('WsVaraEthProvider - Error Handling', () => {
  test('should handle WebSocket constructor throwing error', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, {
      autoConnect: false,
      reconnectAttempts: 1,
    });

    // Make WebSocket constructor throw
    const originalMockWs = mock.mockWs;
    const ErrorThrowingMockWs = function (_url: string) {
      throw new Error('WebSocket constructor failed');
    } as any;

    ErrorThrowingMockWs.CONNECTING = originalMockWs.CONNECTING;
    ErrorThrowingMockWs.OPEN = originalMockWs.OPEN;
    ErrorThrowingMockWs.CLOSING = originalMockWs.CLOSING;
    ErrorThrowingMockWs.CLOSED = originalMockWs.CLOSED;

    mock.mockWs = ErrorThrowingMockWs;
    (global as any).WebSocket = mock.mockWs;

    const connectPromise = provider.connect();

    await expect(connectPromise).rejects.toThrow('WebSocket constructor failed');
    expect(provider.connectionState).toBe('failed');

    // Restore original mock
    mock.mockWs = originalMockWs;
    (global as any).WebSocket = mock.mockWs;
  });

  test('should handle WebSocket connection failures', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, {
      autoConnect: false,
      reconnectAttempts: 1,
    });

    const errorListener = jest.fn();
    provider.on('error', errorListener);

    const connectPromise = provider.connect();

    const ws = mock.getLastInstance()!;
    ws.simulateError();

    await expect(connectPromise).rejects.toThrow('Failed to connect after 1 attempts');
    expect(errorListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        error: expect.any(Error),
      }),
    );
  });

  test('should reject pending requests on connection close', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    const request1 = provider.send(TEST_METHODS.METHOD1, []).catch((e: any) => e);
    const request2 = provider.send(TEST_METHODS.METHOD2, []).catch((e: any) => e);

    ws.simulateClose(1006, '', false);
    await delay(10);

    await expect(request1).resolves.toBeInstanceOf(Error);
    await expect(request2).resolves.toBeInstanceOf(Error);
  });

  test('should gracefully handle JSON parse errors', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Simulate invalid JSON message
    const event = new MessageEvent('message', { data: 'invalid json' });
    ws['messageHandlers'].forEach((handler: any) => handler(event));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to parse JsonRPC response:', expect.any(Error));
    expect(provider.isConnected).toBe(true); // Provider should still be functional

    consoleErrorSpy.mockRestore();
    await provider.disconnect();
  });

  test('should handle errors in event listeners and subscription callbacks', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    let badCallbackCallCount = 0;
    const badCallback = jest.fn((_error) => {
      badCallbackCallCount++;
      // Only throw on first call (message), not on second call (cleanup)
      if (badCallbackCallCount === 1) {
        throw new Error('Callback error');
      }
    });

    const badListener = jest.fn(() => {
      throw new Error('Listener error');
    });
    const goodListener = jest.fn();

    provider.on('disconnected', badListener);
    provider.on('disconnected', goodListener);

    await provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], badCallback);

    // First message initializes subscription
    ws.simulateMessage(createJsonRpcResponse(1, 106));
    await delay(10);

    // Test subscription callback error
    ws.simulateMessage(createSubscriptionMessage(106, { data: 'test' }));
    expect(badCallback).toHaveBeenCalled();

    // Test event listener error
    ws.simulateClose(1000, '', true);
    await delay(10);

    expect(badListener).toHaveBeenCalled();
    expect(goodListener).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

describe('WsVaraEthProvider - Edge Cases', () => {
  test('should handle rapid connect/disconnect cycles', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    for (let i = 0; i < 5; i++) {
      const connectPromise = provider.connect();
      const ws = mock.getLastInstance()!;
      ws.simulateOpen();
      await connectPromise;

      await provider.disconnect();
    }

    expect(provider.connectionState).toBe('disconnected');
  });

  test.each([
    [1000, 'Normal closure', true],
    [1006, 'Abnormal closure', false],
  ])('should handle WebSocket close: code=%i wasClean=%s', async (code, reason, wasClean) => {
    const { provider, ws } = await createConnectedProvider(mock);

    const disconnectListener = jest.fn();
    provider.on('disconnected', disconnectListener);

    ws.simulateClose(code, reason, wasClean);
    await delay(10);

    expect(disconnectListener).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.objectContaining({ code, reason, wasClean }),
      }),
    );
  });

  test('should handle requests sent during disconnect', async () => {
    const { provider } = await createConnectedProvider(mock);

    const disconnectPromise = provider.disconnect();
    const requestPromise = provider.send(TEST_METHODS.TEST, []);

    await disconnectPromise;

    await expect(requestPromise).rejects.toThrow();
  });

  test('should clean up all resources on disconnect', async () => {
    const { provider } = await createConnectedProvider(mock);

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    await provider.subscribe('sub1', 'unsub1', [], callback1);
    await provider.subscribe('sub2', 'unsub2', [], callback2);

    const request1 = provider.send(TEST_METHODS.METHOD1, []);
    const request2 = provider.send(TEST_METHODS.METHOD2, []);

    await provider.disconnect();

    await expect(request1).rejects.toThrow(TEST_ERRORS.MANUALLY_CLOSED);
    await expect(request2).rejects.toThrow(TEST_ERRORS.MANUALLY_CLOSED);

    expect(callback1).toHaveBeenCalledWith(expect.any(Error), null);
    expect(callback2).toHaveBeenCalledWith(expect.any(Error), null);

    expect(provider.connectionState).toBe('disconnected');
    expect(provider.isConnected).toBe(false);
  });

  test('should handle multiple disconnect calls gracefully', async () => {
    const { provider } = await createConnectedProvider(mock);

    await provider.disconnect();
    await provider.disconnect();
    await provider.disconnect();

    expect(provider.connectionState).toBe('disconnected');
    expect(provider.isConnected).toBe(false);
  });

  test('should create new connection promise after failed connection', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, {
      autoConnect: false,
      reconnectAttempts: 1,
    });

    // First connection attempt fails
    const promise1 = provider.connect();
    const ws1 = mock.getLastInstance()!;
    ws1.simulateError();
    await expect(promise1).rejects.toThrow();

    // Second connection attempt should create new promise
    const promise2 = provider.connect();
    expect(promise2).not.toBe(promise1);

    const ws2 = mock.getLastInstance()!;
    ws2.simulateOpen();
    await promise2;

    expect(provider.isConnected).toBe(true);

    await provider.disconnect();
  });

  test('should handle WebSocket send errors for requests', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    ws.shouldThrowOnSend = true;

    const requestPromise = provider.send(TEST_METHODS.TEST, []);

    await expect(requestPromise).rejects.toThrow();

    await provider.disconnect();
  });

  test('should handle WebSocket send errors for subscriptions', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    ws.shouldThrowOnSend = true;

    const callback = jest.fn();

    await expect(provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], callback)).rejects.toThrow();

    await provider.disconnect();
  });

  test('should increment request IDs correctly', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    // Send 3 requests and verify IDs increment
    const request1 = provider.send(TEST_METHODS.METHOD1, []);
    const request2 = provider.send(TEST_METHODS.METHOD2, []);
    const request3 = provider.send(TEST_METHODS.METHOD3, []);

    // Respond with corresponding IDs
    ws.simulateMessage(createJsonRpcResponse(1, 'result1'));
    ws.simulateMessage(createJsonRpcResponse(2, 'result2'));
    ws.simulateMessage(createJsonRpcResponse(3, 'result3'));

    const results = await Promise.all([request1, request2, request3]);
    expect(results).toEqual(['result1', 'result2', 'result3']);

    await provider.disconnect();
  });

  test('should handle global requestTimeout = 0 (disables all timeouts)', async () => {
    const { provider, ws } = await createConnectedProvider(mock, { requestTimeout: 0 });

    const requestPromise = provider.send(TEST_METHODS.TEST, []);

    // Wait longer than normal timeout would allow
    await delay(200);

    // Request should still be pending
    ws.simulateMessage(createJsonRpcResponse(1, 'delayed_result'));

    const result = await requestPromise;
    expect(result).toBe('delayed_result');

    await provider.disconnect();
  });

  test('should stop queue processing if connection closes mid-processing', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    const connectPromise = provider.connect();

    // Queue multiple requests with immediate error handlers
    const request1 = provider.send(TEST_METHODS.METHOD1, []);
    const request2 = provider.send(TEST_METHODS.METHOD2, []).catch((e) => e);
    const request3 = provider.send(TEST_METHODS.METHOD3, []).catch((e) => e);

    const ws = mock.getLastInstance()!;
    ws.simulateOpen();
    await connectPromise;
    await delay(10);

    // Respond to first request
    ws.simulateMessage(createJsonRpcResponse(1, 'result1'));

    // Close connection before other requests complete
    ws.simulateClose(1006, 'Connection lost', false);
    await delay(10);

    // First request should succeed
    await expect(request1).resolves.toBe('result1');

    // Other requests should fail
    await expect(request2).resolves.toBeInstanceOf(Error);
    await expect(request3).resolves.toBeInstanceOf(Error);
  });

  test('should handle removal of non-existent event listener', () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    const listener = jest.fn();

    // Remove listener that was never added
    provider.off('connected', listener);

    // Should not throw
    expect(() => provider.off('connected', listener)).not.toThrow();
  });

  test('should handle removal of listeners from event with no listeners', () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    // Remove all listeners from event that has none
    expect(() => provider.off('connected')).not.toThrow();
  });

  test('should clean up event listener map when last listener is removed', () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, { autoConnect: false });

    const listener1 = jest.fn();
    const listener2 = jest.fn();

    // Add two listeners to the same event
    provider.on('connected', listener1);
    provider.on('connected', listener2);

    // Remove first listener - event should still exist
    provider.off('connected', listener1);

    // Remove second listener - event key should be cleaned up from map
    provider.off('connected', listener2);

    // Adding a new listener should work fine (verifies cleanup worked)
    const listener3 = jest.fn();
    expect(() => provider.on('connected', listener3)).not.toThrow();
  });

  test('should handle connection close during queue processing', async () => {
    const provider = new WsVaraEthProvider(TEST_WS_URL, {
      autoConnect: false,
      reconnectAttempts: 1,
      reconnectDelay: 10,
    });

    const connectPromise = provider.connect();

    // Queue requests
    const request1 = provider.send(TEST_METHODS.METHOD1, []);
    const request2 = provider.send(TEST_METHODS.METHOD2, []);

    const ws = mock.getLastInstance()!;

    // Close connection before opening (simulating immediate failure)
    ws.simulateError();

    await expect(connectPromise).rejects.toThrow();

    // Queued requests should be rejected
    await expect(request1).rejects.toThrow();
    await expect(request2).rejects.toThrow();
  });

  test('should clean up timeout when request completes successfully', async () => {
    const { provider, ws } = await createConnectedProvider(mock, { requestTimeout: 5000 });

    const requestPromise = provider.send(TEST_METHODS.TEST, []);

    // Immediately respond
    ws.simulateMessage(createJsonRpcResponse(1, 'quick_result'));

    const result = await requestPromise;
    expect(result).toBe('quick_result');

    // Wait to ensure timeout doesn't fire
    await delay(100);

    // Provider should still be connected (timeout was cleaned up)
    expect(provider.isConnected).toBe(true);

    await provider.disconnect();
  });

  test('should handle responses with mismatched IDs gracefully', async () => {
    const { provider, ws } = await createConnectedProvider(mock);

    const request1 = provider.send(TEST_METHODS.METHOD1, []);

    // Respond with wrong ID (999 instead of 1)
    ws.simulateMessage(createJsonRpcResponse(999, 'wrong_id_result'));

    // Original request should still be pending
    await delay(50);

    // Now send correct response
    ws.simulateMessage(createJsonRpcResponse(1, 'correct_result'));

    const result = await request1;
    expect(result).toBe('correct_result');

    await provider.disconnect();
  });

  test('should handle unsubscribe of non-existent subscription', async () => {
    const { provider } = await createConnectedProvider(mock);

    const callback = jest.fn();
    const unsubscribe = await provider.subscribe(TEST_METHODS.SUBSCRIBE, 'test_unsubscribe', [], callback);

    // Unsubscribe twice
    unsubscribe();
    expect(() => unsubscribe()).not.toThrow();

    await provider.disconnect();
  });
});
