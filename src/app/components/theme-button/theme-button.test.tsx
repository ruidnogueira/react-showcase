import { composeStories } from '@storybook/testing-react';
import { renderStoryWithProviders, renderWithProviders } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import { axe } from 'jest-axe';
import * as stories from './theme-button.stories';
import { ThemeButton } from './theme-button';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStoryWithProviders(<Story />, { hideVariants: false });
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { container } = renderStoryWithProviders(<Story />, { hideVariants: false });
  expect(await axe(container)).toHaveNoViolations();
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
  renderWithProviders(<ThemeButton />, { defaultTheme: 'light' });

  await userEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }));

  expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument();
});

test('switches to light theme', async () => {
  renderWithProviders(<ThemeButton />, { defaultTheme: 'dark' });

  await userEvent.click(screen.getByRole('button', { name: /switch to light theme/i }));

  expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument();
});
