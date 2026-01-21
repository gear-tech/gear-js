import { FieldsetHTMLAttributes, SelectHTMLAttributes, OptionHTMLAttributes, InputHTMLAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';
import { Sails } from 'sails-js';
import { ISailsTypeDef } from 'sails-js-types';

type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & { legend: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: readonly OptionHTMLAttributes<HTMLOptionElement>[];
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & { name: string; label: string };
type TextareaProps = InputHTMLAttributes<HTMLTextAreaElement> & { name: string; label: string };
type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & { name: string; label: string };

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
      input: (props: InputProps) => JSX.Element;
      textarea: (props: TextareaProps) => JSX.Element;
      checkbox: (props: CheckboxProps) => JSX.Element;
    };
  };

  renderField: (def: ISailsTypeDef, label: string, name: string) => JSX.Element | undefined;
};

export type { FieldProps };
