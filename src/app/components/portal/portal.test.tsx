import { screen, within } from '@testing-library/react';
import { render } from 'src/test/helpers/render';
import { Portal } from './portal';

test('renders a subtree in a different part of the DOM', () => {
  render(
    <div data-testid="content">
      <Portal>Portalled content</Portal>
    </div>
  );

  const content = screen.getByTestId('content');

  expect(within(content).queryByText('Portalled content')).not.toBeInTheDocument();
  expect(screen.getByText('Portalled content')).toBeInTheDocument();
});
