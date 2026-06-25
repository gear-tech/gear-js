import type { OptionHTMLAttributes, PropsWithChildren, SelectHTMLAttributes } from 'react';
import type { JSX } from 'react/jsx-runtime';
import type { SailsProgram } from 'sails-js';
import type { Type, TypeDecl } from 'sails-js/types';

type FieldsetProps = PropsWithChildren & { legend: string };

type SelectProps = Pick<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> & {
  options: readonly OptionHTMLAttributes<HTMLOptionElement>[];
};

type RHFProps = { name: string; label: string };

type FieldProps = {
  program: SailsProgram;
  serviceName?: string;
  def: TypeDecl;
  resolvedType?: Type;
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

  renderField: (def: TypeDecl, label: string, name: string, resolvedType?: Type) => JSX.Element | undefined;
};

export type { FieldProps };
