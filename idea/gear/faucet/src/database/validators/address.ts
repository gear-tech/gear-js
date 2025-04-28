import { decodeAddress } from '@polkadot/util-crypto';
import { isEthereumAddress, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { FaucetType } from '../model/enums';

export function isValidAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidAddress',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          if (obj.type === FaucetType.VaraTestnet) {
            if (typeof value !== 'string' || !value.startsWith('0x')) return false;
            try {
              if (decodeAddress(value).length === 32) {
                return true;
              }
            } catch (error) {
              return false;
            }
          } else {
            return isEthereumAddress(value);
          }
        },
      },
    });
  };
}
