import { Injectable } from '@nestjs/common';

@Injectable()
export class RpcMethods {
  getMethod(methodName) {
    const method = methodName.split('.');
    let result = Object.getOwnPropertyDescriptor(this, method[0]);
    if (result && method.length > 1) {
      method.slice(1).forEach((element) => {
        result = Object.getOwnPropertyDescriptor(result.value, element);
        if (!result) {
          return undefined;
        }
      });
    }
    return result ? result.value : result;
  }
}
