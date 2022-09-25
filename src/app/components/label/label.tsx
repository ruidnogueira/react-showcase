import { forwardRef, LabelHTMLAttributes } from 'react';
import clsx from 'clsx';
import { ControlSize } from '@/app/types/styles';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * The size of the label
   */
  size?: ControlSize;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const { className, size = 'medium', ...labelProps } = props;
  return <label {...labelProps} ref={ref} className={clsx('label', `label--${size}`, className)} />;
});
