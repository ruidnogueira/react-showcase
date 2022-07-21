import { composeStories } from '@storybook/testing-react';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { render, renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import { TextInput } from '../text-input/text-input';
import { Field } from './field';
import * as stories from './field.stories';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />, { hideVariants: false });
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { container } = renderStory(<Story />, { hideVariants: false });
  expect(await axe(container)).toHaveNoViolations();
});

test('uses input id for label', () => {
  render(
    <Field label="First name">
      <TextInput id="firstName" type="text" />
    </Field>
  );

  const input = screen.getByLabelText('First name');
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('id', 'firstName');
});

test('generates id for label if input does not have one', () => {
  render(
    <Field label="First name">
      <TextInput type="text" />
    </Field>
  );

  const input = screen.getByLabelText('First name');
  expect(input).toBeInTheDocument();
  expect(input.id).toMatch(/^field-input-.*/);
});
