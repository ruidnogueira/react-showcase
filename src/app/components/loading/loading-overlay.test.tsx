import * as stories from './loading-overlay.stories';
import { composeStories } from '@storybook/testing-react';
import { render, renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import { axe } from 'src/test/helpers/axe';
import { LoadingOverlay } from './loading-overlay';
import { screen } from '@testing-library/react';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />);
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { baseElement } = renderStory(<Story />);
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('shows spinner when loading', () => {
  render(<LoadingOverlay isLoading={true}>Loaded content</LoadingOverlay>);

  expect(screen.getByText('Loaded content')).toBeInTheDocument();
  expect(screen.getByText('Loading')).toBeInTheDocument();
});

test('does not show spinner when not loading', () => {
  render(<LoadingOverlay isLoading={false}>Loaded content</LoadingOverlay>);

  expect(screen.getByText('Loaded content')).toBeInTheDocument();
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();
});
