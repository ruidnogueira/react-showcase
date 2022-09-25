import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { ControlSize } from '@/app/types/styles';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * The size of the input
   */
  size?: ControlSize;

  /**
   * Whether the input should appear as invalid
   */
  isInvalid?: boolean;

  /**
   * The type of the text input
   */
  type: 'text' | 'email' | 'password' | 'search' | 'tel';
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { className, size = 'medium', isInvalid = false, ...inputProps } = props;

  return (
    <input
      {...inputProps}
      ref={ref}
      className={clsx('input', `input--${size}`, { ['input--invalid']: isInvalid }, className)}
    />
  );
});
