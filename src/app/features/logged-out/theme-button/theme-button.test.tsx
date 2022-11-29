import { composeStories } from '@storybook/testing-react';
import { renderStoryWithProviders, renderWithProviders } from '@/test/helpers/render';
import { getStoryTestCases } from '@/test/helpers/test';
import * as stories from './theme-button.stories';
import { ThemeButton } from './theme-button';
import { screen } from '@testing-library/react';
import { axe } from '@/test/helpers/axe';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStoryWithProviders(<Story />);
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accessibility violations', async (_, Story) => {
  const { baseElement } = renderStoryWithProviders(<Story />);
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('shows light theme', () => {
  renderWithProviders(<ThemeButton />, { defaultTheme: 'light' });

  expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument();
});

test('shows dark theme', () => {
  renderWithProviders(<ThemeButton />, { defaultTheme: 'dark' });

  expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument();
});

test('switches to dark theme', async () => {
  const { userEvent } = renderWithProviders(<ThemeButton />, { defaultTheme: 'light' });

  await userEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }));

  expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument();
});

test('switches to light theme', async () => {
  const { userEvent } = renderWithProviders(<ThemeButton />, { defaultTheme: 'dark' });

  await userEvent.click(screen.getByRole('button', { name: /switch to light theme/i }));

  expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument();
});
