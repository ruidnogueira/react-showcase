const domRectMock: Partial<typeof DOMRect> = {
  fromRect: vi.fn().mockReturnValue({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  }),
};

vi.stubGlobal('DOMRect', domRectMock);

export {};
