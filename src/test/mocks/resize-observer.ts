const resizeObserverMock: typeof ResizeObserver = vi
  .fn()
  .mockImplementation((callback: ResizeObserverCallback) => ({
    observe: vi.fn().mockImplementation(() => {
      const entries: jest.Mocked<Partial<ResizeObserverEntry>[]> = [
        { borderBoxSize: [{ blockSize: 0, inlineSize: 0 }] },
      ];
      callback(entries as unknown as ResizeObserverEntry[], undefined as unknown as ResizeObserver);
    }),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

vi.stubGlobal('ResizeObserver', resizeObserverMock);

export {};
