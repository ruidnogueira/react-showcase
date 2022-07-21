import { Slot } from '@radix-ui/react-slot';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { ReactElement, ReactNode, useId, useState } from 'react';
import { ControlSize } from 'src/app/models/styles';
import { Label } from '../label/label';
import styles from './field.module.scss';

export interface FieldProps {
  className?: string;

  /**
   * The input element
   */
  children: ReactElement;

  /**
   * The content of the label
   */
  label: ReactNode;

  /**
   * Whether the label is visually visible or not
   */
  showLabel?: boolean;

  /**
   * The size of the field
   */
  size?: ControlSize;
}

export function Field(props: FieldProps) {
  const { className, size, children, label, showLabel = true } = props;

  const { inputId, setInput } = useInputId();

  const labelComponent = (
    <Label htmlFor={inputId} className={styles.label} size={size}>
      {label}
    </Label>
  );

  return (
    <span className={clsx(styles.field, className)}>
      {showLabel ? labelComponent : <VisuallyHidden asChild>{labelComponent}</VisuallyHidden>}

      <Slot ref={setInput} id={inputId}>
        {children}
      </Slot>
    </span>
  );
}

function useInputId() {
  const [input, setInput] = useState<HTMLElement | null>(null);
  const generatedInputId = useId();

  let inputId: string | undefined = undefined;

  if (input) {
    inputId = input.id ? input.id : `field-input-${generatedInputId}`;
  }

  return { inputId, setInput };
}
