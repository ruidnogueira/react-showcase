import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, renderStory } from 'src/test/helpers/render';
import { Select, SelectItem } from './select';
import * as stories from './select.stories';
import { composeStories } from '@storybook/testing-react';
import { getStoryTestCases } from 'src/test/helpers/test';
import { axe } from 'src/test/helpers/axe';

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

test('selects an option', async () => {
  render(
    <Select>
      <SelectItem value="red">Red</SelectItem>
      <SelectItem value="green">Green</SelectItem>
      <SelectItem value="blue">Blue</SelectItem>
    </Select>
  );

  await userEvent.type(screen.getByRole('combobox'), '{enter}');
  await userEvent.click(screen.getByRole('option', { name: 'Red' }));

  expect(screen.getByRole('combobox')).toHaveTextContent('Red');
});

test('cannot select a disabled option', async () => {
  render(
    <Select>
      <SelectItem value="red" disabled={true}>
        Red
      </SelectItem>
      <SelectItem value="green">Green</SelectItem>
      <SelectItem value="blue">Blue</SelectItem>
    </Select>
  );

  await userEvent.type(screen.getByRole('combobox'), '{enter}');
  await userEvent.click(screen.getByRole('option', { name: 'Red' }));

  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Red' })).toHaveAttribute('aria-disabled', 'true');
});

test('is disabled', async () => {
  render(
    <Select disabled={true}>
      <SelectItem value="red">Red</SelectItem>
      <SelectItem value="green">Green</SelectItem>
      <SelectItem value="blue">Blue</SelectItem>
    </Select>
  );

  await userEvent.type(screen.getByRole('combobox'), '{enter}');

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(screen.getByRole('combobox')).toBeDisabled();
});
