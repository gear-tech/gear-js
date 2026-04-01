import {
  isEmpty,
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsOneOfConstraint implements ValidatorConstraintInterface {
  validate(value: any, { constraints }: ValidationArguments) {
    const [allowedValues, required] = constraints;
    if (!required && isEmpty(value)) {
      return true;
    }
    return allowedValues.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const [allowedValues] = args.constraints;
    return `Value must be one of the following: ${allowedValues.join(', ')}`;
  }
}

export function IsOneOf(values: string[], required = false, options?: ValidationOptions) {
  return (obj: any, propertyName: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options,
      constraints: [values, required],
      validator: IsOneOfConstraint,
    });
  };
}
