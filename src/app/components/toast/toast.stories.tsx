import { StoryVariants } from '@/stories/variants';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { useRef } from 'react';
import { Button } from '../button/button';
import { Toast } from './toast';
import { ToastProvider, useToast } from './toast-context';
import { ToastPosition, ToastTypes } from './toast-types';

export default {
  title: 'Components/Toast',
  component: Toast,
  argTypes: {},
  args: {
    children: 'Example toast',
  },
} as ComponentMeta<typeof Toast>;

export const Default: ComponentStoryObj<typeof Toast> = {
  render: (args) => (
    <StoryVariants direction="column">
      <Toast {...args} />

      {ToastTypes.map((type) => (
        <Toast key={type} {...args} type={type} />
      ))}
    </StoryVariants>
  ),
};

export const Closable: ComponentStoryObj<typeof Toast> = {
  ...Default,
  args: {
    isClosable: true,
  },
};

export const Playground: ComponentStoryObj<typeof Toast> = {
  render: () => <PlaygroundComponent />,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

function PlaygroundComponent() {
  const toast = useToast();
  const count = useRef(0);

  const handleClick = (position: ToastPosition) => {
    count.current++;

    toast.open({
      position,
      message: `Example toast ${count.current}`,
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center',
        gap: '6px',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)',
      }}
    >
      <ToastButton position="top-left" onClick={handleClick} row={1} column={2} />
      <ToastButton position="top" onClick={handleClick} row={1} column={3} />
      <ToastButton position="top-right" onClick={handleClick} row={1} column={4} />

      <ToastButton position="bottom-left" onClick={handleClick} row={3} column={2} />
      <ToastButton position="bottom" onClick={handleClick} row={3} column={3} />
      <ToastButton position="bottom-right" onClick={handleClick} row={3} column={4} />
    </div>
  );
}

function ToastButton(props: {
  row: number;
  column: number;
  position: ToastPosition;
  onClick: (position: ToastPosition) => void;
}) {
  return (
    <Button
      type="button"
      onClick={() => props.onClick(props.position)}
      style={{ width: '120px', gridRow: props.row, gridColumn: props.column }}
    >
      {props.position}
    </Button>
  );
}
