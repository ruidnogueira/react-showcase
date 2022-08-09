const locationMock: Partial<Location> = { reload: vi.fn() };

vi.stubGlobal('location', locationMock);

export {};
