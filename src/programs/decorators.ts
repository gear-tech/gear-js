import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProgramHash = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.query.hash;
  },
);
