import { OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { RpcMessageHandler } from 'src/json-rpc/handler';
import {
  AddMetaParams,
  AddPayloadParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaParams,
  GetOutgoingMessagesParams,
  GetTestBalanceParams,
} from '@gear-js/backend-interfaces';
export declare class ApiGatewayService extends RpcMessageHandler implements OnModuleInit {
  constructor();
  client: ClientKafka;
  patterns: string[];
  onModuleInit(): Promise<void>;
  methods: {
    program: {
      data: (params: FindProgramParams) => import('rxjs').Observable<any>;
      addMeta: (params: AddMetaParams) => import('rxjs').Observable<any>;
      getMeta: (params: GetMetaParams) => import('rxjs').Observable<any>;
      meta: {
        add: (params: AddMetaParams) => import('rxjs').Observable<any>;
        get: (params: GetMetaParams) => import('rxjs').Observable<any>;
      };
      all: (params: GetAllProgramsParams) => import('rxjs').Observable<any>;
      allUser: (params: GetAllProgramsParams) => import('rxjs').Observable<any>;
    };
    message: {
      all: (params: GetMessagesParams) => import('rxjs').Observable<any>;
      incoming: (params: GetIncomingMessagesParams) => import('rxjs').Observable<any>;
      outgoing: (params: GetOutgoingMessagesParams) => import('rxjs').Observable<any>;
      savePayload: (params: AddPayloadParams) => import('rxjs').Observable<any>;
      countUnread: () => void;
    };
    testBalance: {
      get: (params: GetTestBalanceParams) => import('rxjs').Observable<any>;
    };
  };
}
