import { ConfigProvider } from 'src/app/contexts/config/config-context';
import { I18nProvider } from './i18n-context';
import { render } from 'src/test/helpers/render';
import { screen } from '@testing-library/react';
import i18next from 'i18next';

vi.mock('i18next', () => ({
  default: {
    isInitialized: false,
    use: vi.fn().mockImplementation(function (this: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this;
    }),
    init: vi.fn(),
    services: {
      formatter: {
        add: vi.fn(),
      },
    },
  },
}));

test('renders', () => {
  render(
    <ConfigProvider>
      <I18nProvider>children</I18nProvider>
    </ConfigProvider>
  );

  expect(screen.getByText('children')).toBeInTheDocument();
});

test('initializes i18n if not initialized', () => {
  render(
    <ConfigProvider>
      <I18nProvider>children</I18nProvider>
    </ConfigProvider>
  );

  // eslint-disable-next-line @typescript-eslint/unbound-method, import/no-named-as-default-member
  expect(i18next.init).toHaveBeenCalledTimes(1);
});

test('does not initialize i18n if not initialized', () => {
  i18next.isInitialized = true;

  render(
    <ConfigProvider>
      <I18nProvider>children</I18nProvider>
    </ConfigProvider>
  );

  // eslint-disable-next-line @typescript-eslint/unbound-method, import/no-named-as-default-member
  expect(i18next.init).not.toHaveBeenCalled();
});
