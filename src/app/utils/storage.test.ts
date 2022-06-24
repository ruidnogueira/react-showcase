import {
  saveToLocalStorage,
  saveToSessionStorage,
  getFromLocalStorage,
  getFromSessionStorage,
} from './storage';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as unknown as Storage;
global.sessionStorage = sessionStorageMock as unknown as Storage;

describe.each([
  ['localStorage', localStorageMock, saveToLocalStorage, getFromLocalStorage],
  ['sessionStorage', sessionStorageMock, saveToSessionStorage, getFromSessionStorage],
])('%s', (_, storageMock, saveToStorage, getFromStorage) => {
  test('saves item', () => {
    const storageKey = 'testKey';
    const value = 'Test value';

    saveToStorage(storageKey, value);

    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith(storageKey, JSON.stringify(value));
  });

  test('does nothing if it fails to save item', () => {
    const storageKey = 'testKey';
    const value = 'Test value';

    storageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Example error');
    });

    expect(() => saveToStorage(storageKey, value)).not.toThrow();
  });

  test('gets item', () => {
    const storageKey = 'testKey';
    const value = 'Test value';

    storageMock.getItem.mockImplementationOnce((key) =>
      key === storageKey ? JSON.stringify(value) : JSON.stringify('Wrong value')
    );

    const result = getFromStorage(storageKey);

    expect(result).toEqual(value);
  });

  test('returns null if item is not found', () => {
    const storageKey = 'testKey';

    storageMock.getItem.mockReturnValueOnce(null);

    const result = getFromStorage(storageKey);

    expect(result).toBeNull();
  });

  test('returns null if it fails to get item', () => {
    const storageKey = 'testKey';

    storageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Example error');
    });

    const result = getFromStorage(storageKey);

    expect(result).toBeNull();
  });
});
