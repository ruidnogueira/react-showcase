import * as SelectPrimitive from '@radix-ui/react-select';
import clsx from 'clsx';
import { CaretDown, Check } from 'phosphor-react';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { usePortalContainer } from 'src/app/contexts/portal-container/portal-container';
import { ControlSize } from 'src/app/models/styles';

/* TODO: check if labels work */
/* TODO: ban radix imports */
/* TODO: tests */

export interface SelectProps extends Omit<SelectPrimitive.SelectTriggerProps, 'placeholder'> {
  children: ReactNode;
  name?: string;

  /**
   * The placeholder of the select.
   */
  placeholder?: ReactNode;

  /**
   * The size of the select
   */
  size?: ControlSize;

  /**
   * Whether the select should appear as invalid
   */
  isInvalid?: boolean;

  /**
   * The value of the select when it first renders.
   *
   * Use it when you do not need to control the open state.
   */
  defaultValue?: string;

  /**
   * The value of the select.
   *
   * Use it in conjunction with `onValueChange`.
   */
  value?: string;

  /**
   * Event handler for when the value of the select changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Whether the select is open or not when it first renders.
   *
   * Use it when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

  /**
   * Whether the select is open or not.
   *
   * Use it conjunction with `onIsOpenChange`.
   */
  isOpen?: boolean;

  /**
   * Event handler for when the open state of the select changes.
   */
  onIsOpenChange?: (isOpen: boolean) => void;
}

export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

  /**
   * The value of the item.
   */
  value: string;

  /**
   * Optional text used for typeahead purposes.
   * By default the typeahead behavior will use the text content of the item.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /**
   * Whether the item is disabled or not.
   */
  disabled?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  const {
    children,
    className,
    placeholder,
    size = 'medium',
    isInvalid = false,
    defaultValue,
    value,
    onValueChange,
    defaultIsOpen,
    isOpen,
    onIsOpenChange,
    ...selectProps
  } = props;

  const portalContainer = usePortalContainer();

  return (
    <SelectPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      defaultOpen={defaultIsOpen}
      open={isOpen}
      onOpenChange={onIsOpenChange}
    >
      <SelectPrimitive.Trigger
        {...selectProps}
        ref={ref}
        className={clsx('select', `select--${size}`, { ['select--invalid']: isInvalid }, className)}
      >
        <SelectPrimitive.Value
          placeholder={<span className="select__placeholder">{placeholder}</span>}
        />
        <SelectPrimitive.Icon className="select__icon-wrapper">
          <CaretDown className="select__icon" weight="bold" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal container={portalContainer}>
        <SelectPrimitive.Content className={clsx('select__dropdown', `select__dropdown--${size}`)}>
          <SelectPrimitive.ScrollUpButton />

          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>

          <SelectPrimitive.ScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>((props, ref) => {
  const { children, className, ...itemProps } = props;

  return (
    <SelectPrimitive.Item {...itemProps} ref={ref} className={clsx('select__item', className)}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator className="select__item-indicator">
        <Check weight="bold" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});
