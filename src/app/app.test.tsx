import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from 'src/test/helpers/render';
import { App } from './app';

test('renders app', () => {
  renderWithProviders(<App />);
  expect(screen.getByText(/^hello world!$/i)).toBeInTheDocument();
});

test('increments count', async () => {
  renderWithProviders(<App />);

  expect(screen.getByRole('button', { name: 'count is: 0' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'count is: 0' }));
  await userEvent.click(screen.getByRole('button', { name: 'count is: 1' }));
  await userEvent.click(screen.getByRole('button', { name: 'count is: 2' }));

  expect(screen.getByRole('button', { name: 'count is: 3' })).toBeInTheDocument();
});
