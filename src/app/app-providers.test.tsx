import { renderWithProviders } from '@/test/helpers/render';
import { AppProviders } from './app-providers';

test('renders providers', () => {
  const { container } = renderWithProviders(<AppProviders>children</AppProviders>);
  expect(container).toBeInTheDocument();
});
