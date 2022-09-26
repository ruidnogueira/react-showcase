import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Toast } from '../toast/toast';
import { ServiceWorkerMessage } from './service-worker-message';

export default {
  title: 'Organisms/ServiceWorkerMessage',
  args: {
    onRefreshClick: () => {},
  },
} as ComponentMeta<typeof ServiceWorkerMessage>;

export const OfflineReady: ComponentStoryObj<typeof ServiceWorkerMessage> = {
  render: (args) => (
    <Toast>
      <ServiceWorkerMessage {...args} type="offlineReady" />
    </Toast>
  ),
};

export const NeedRefresh: ComponentStoryObj<typeof ServiceWorkerMessage> = {
  render: (args) => (
    <Toast isClosable={true}>
      <ServiceWorkerMessage {...args} type="needRefresh" />
    </Toast>
  ),
};
