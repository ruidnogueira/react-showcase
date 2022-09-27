import { LanguageSelect } from './language-select';
import * as stories from './language-select.stories';
import { composeStories } from '@storybook/testing-react';
import { getStoryTestCases } from '@/test/helpers/test';
import { axe } from '@/test/helpers/axe';
import { render, renderStory } from '@/test/helpers/render';
import { ConfigProvider } from '@/app/contexts/config/config-context';
import { I18nextProvider } from 'react-i18next';
import { act, screen } from '@testing-library/react';
import { i18nMock } from '@/mocks/i18n';
import { Resource } from 'i18next';
import userEvent from '@testing-library/user-event';

const supportedLanguages = [
  { code: 'en-GB', name: 'GB' },
  { code: 'en-US', name: 'US' },
  { code: 'pt-PT', name: 'PT' },
];

const resources = supportedLanguages.reduce<Resource>((resources, language) => {
  resources[language.code] = {};
  return resources;
}, {});

const testI18n = i18nMock.cloneInstance({
  resources,
});

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(
    <ConfigProvider>
      <Story />
    </ConfigProvider>
  );
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accessibility violations', async (_, Story) => {
  const { baseElement } = renderStory(
    <ConfigProvider>
      <Story />
    </ConfigProvider>
  );

  expect(await axe(baseElement)).toHaveNoViolations();
});

test('changes language when new option is selected', async () => {
  setup();

  const selectButton = screen.getByRole('combobox');
  expect(selectButton).toHaveTextContent('GB');

  await userEvent.click(selectButton);
  await userEvent.click(screen.getByRole('option', { name: 'PT' }));

  expect(selectButton).toHaveTextContent('PT');
  expect(testI18n.languages[0]).toBe('pt-PT');
});

test('updates selected language on i18n language changes', () => {
  setup();

  expect(screen.getByRole('combobox')).toHaveTextContent('GB');

  act(() => {
    void testI18n.changeLanguage('pt-PT');
  });

  expect(screen.getByRole('combobox')).toHaveTextContent('PT');
});

function setup() {
  void testI18n.changeLanguage('en-GB');

  render(
    <ConfigProvider config={{ i18nConfig: { supportedLanguages } }}>
      <I18nextProvider i18n={testI18n}>
        <LanguageSelect />
      </I18nextProvider>
    </ConfigProvider>
  );
}
