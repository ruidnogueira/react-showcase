import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/helpers/render';
import { App } from './app';

test('renders app', () => {
  renderWithProviders(<App />);
  expect(screen.getByText(/^hello world!$/i)).toBeInTheDocument();
});

test('increments count', async () => {
  const { userEvent } = renderWithProviders(<App />);

  expect(screen.getByRole('button', { name: 'count is: 0' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'count is: 0' }));
  await userEvent.click(screen.getByRole('button', { name: 'count is: 1' }));
  await userEvent.click(screen.getByRole('button', { name: 'count is: 2' }));

  expect(screen.getByRole('button', { name: 'count is: 3' })).toBeInTheDocument();
});
