// TODO: Remove this once https://github.com/nickcolley/jest-axe/issues/147 is fixed.
const { getComputedStyle } = window;
vi.stubGlobal('getComputedStyle', (elt: Element) => getComputedStyle(elt));

export {};
