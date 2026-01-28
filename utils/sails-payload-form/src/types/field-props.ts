import { SelectHTMLAttributes, OptionHTMLAttributes, PropsWithChildren } from 'react';
import { JSX } from 'react/jsx-runtime';
import { Sails } from 'sails-js';
import { ISailsTypeDef } from 'sails-js-types';

type FieldsetProps = PropsWithChildren & { legend: string };

type SelectProps = Pick<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> & {
  options: readonly OptionHTMLAttributes<HTMLOptionElement>[];
};

type RHFProps = { name: string; label: string };

type FieldProps = {
  sails: Sails;
  def: ISailsTypeDef;
  name: string;
  label: string;

  render: {
    ui: {
      fieldset: (props: FieldsetProps) => JSX.Element;
      select: (props: SelectProps) => JSX.Element;
    };

    rhf: {
      input: (props: RHFProps) => JSX.Element;
      textarea: (props: RHFProps) => JSX.Element;
      checkbox: (props: RHFProps) => JSX.Element;
    };
  };

  renderField: (def: ISailsTypeDef, label: string, name: string) => JSX.Element | undefined;
};

export type { FieldProps };
