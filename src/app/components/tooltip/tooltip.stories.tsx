import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ReactNode } from 'react';
import { Button } from '../button/button';
import { Tooltip, TooltipProps } from './tooltip';

export default {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  args: {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
} as ComponentMeta<typeof Tooltip>;

export const Default: ComponentStoryObj<typeof Tooltip> = {
  render: (args) => (
    <Tooltip {...args} style={{ maxWidth: '200px' }}>
      <Button type="button">Button</Button>
    </Tooltip>
  ),
};

export const Open: ComponentStoryObj<typeof Tooltip> = {
  ...Default,
  args: {
    isOpen: true,
  },
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: 300,
    },
  },
};

export const Playground: ComponentStoryObj<typeof Tooltip> = {
  render: (args) => (
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
      <ButtonWithTooltip {...args} side="top" align="start" row={1} column={2}>
        TS
      </ButtonWithTooltip>
      <ButtonWithTooltip {...args} side="top" align="center" row={1} column={3}>
        TC
      </ButtonWithTooltip>
      <ButtonWithTooltip {...args} side="top" align="end" row={1} column={4}>
        TE
      </ButtonWithTooltip>

      <ButtonWithTooltip {...args} side="left" align="start" row={2} column={1}>
        LS
      </ButtonWithTooltip>
      <ButtonWithTooltip {...args} side="left" align="center" row={3} column={1}>
        LC
      </ButtonWithTooltip>
      <ButtonWithTooltip {...args} side="left" align="end" row={4} column={1}>
        LE
      </ButtonWithTooltip>

      <ButtonWithTooltip {...args} side="right" align="start" row={2} column={5}>
        RS
      </ButtonWithTooltip>
      <ButtonWithTooltip {...args} side="right" align="center" row={3} column={5}>
        RC
      </ButtonWithTooltip>
      <ButtonWithTooltip {...args} side="right" align="end" row={4} column={5}>
        RE
      </ButtonWithTooltip>

      <ButtonWithTooltip {...args} side="bottom" align="start" row={5} column={2}>
        BS
      </ButtonWithTooltip>
      <ButtonWithTooltip {...args} side="bottom" align="center" row={5} column={3}>
        BC
      </ButtonWithTooltip>
      <ButtonWithTooltip {...args} side="bottom" align="end" row={5} column={4}>
        BE
      </ButtonWithTooltip>
    </div>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};

function ButtonWithTooltip(
  props: Omit<TooltipProps, 'children'> & { children: ReactNode; row: number; column: number }
) {
  const { children, row, column, ...args } = props;

  return (
    <Tooltip {...args} style={{ maxWidth: '200px' }}>
      <Button type="button" style={{ width: '60px', gridRow: row, gridColumn: column }}>
        {children}
      </Button>
    </Tooltip>
  );
}
