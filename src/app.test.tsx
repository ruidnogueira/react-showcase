import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './app';

test('renders app', () => {
  render(<App />);
  expect(screen.getByText('Hello Vite + React!')).toBeInTheDocument();
});

test('increments count', async () => {
  render(<App />);

  expect(screen.getByRole('button', { name: 'count is: 0' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'count is: 0' }));
  await userEvent.click(screen.getByRole('button', { name: 'count is: 1' }));
  await userEvent.click(screen.getByRole('button', { name: 'count is: 2' }));

  expect(screen.getByRole('button', { name: 'count is: 3' })).toBeInTheDocument();
});
