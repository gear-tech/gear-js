import React from 'react';
import { Label, Switch as SwitchEl } from './styles';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, Props>(({ label, ...props }, ref) => (
  <Label>
    <SwitchEl>
      <input {...props} type="checkbox" ref={ref} />
      <span className="slider" />
    </SwitchEl>
    <span>{label}</span>
  </Label>
));
