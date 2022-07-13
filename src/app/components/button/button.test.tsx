import { composeStories } from '@storybook/testing-react';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import * as stories from './button.stories';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

const { Disabled } = composedStories;

test.each(storyTestCases)('renders %s story', (_, render) => {
  const { container } = render();
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, render) => {
  const { baseElement } = render();
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('is disabled', () => {
  renderStory(<Disabled />);
  expect(screen.getByRole('button')).toBeDisabled();
});
