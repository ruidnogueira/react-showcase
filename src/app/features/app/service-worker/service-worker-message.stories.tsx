import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Toast } from '../../../components/toast/toast';
import { ServiceWorkerMessage } from './service-worker-message';
import styles from './service-worker-message.module.scss';

export default {
  title: 'Features/App/ServiceWorkerMessage',
  args: {
    onRefreshClick: () => {},
  },
} as ComponentMeta<typeof ServiceWorkerMessage>;

export const OfflineReady: ComponentStoryObj<typeof ServiceWorkerMessage> = {
  render: (args) => (
    <Toast className={styles.toast}>
      <ServiceWorkerMessage {...args} type="offlineReady" />
    </Toast>
  ),
};

export const NeedRefresh: ComponentStoryObj<typeof ServiceWorkerMessage> = {
  render: (args) => (
    <Toast className={styles.toast} isClosable={true}>
      <ServiceWorkerMessage {...args} type="needRefresh" />
    </Toast>
  ),
};
