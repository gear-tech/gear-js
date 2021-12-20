import { logLevel } from 'kafkajs';
export declare const Logger: (labelName: string) => import('winston').Logger;
export declare const KafkaLogger: (loggerLevel: logLevel) => ({
  log: { message, ...extra },
}: {
  log: {
    [x: string]: any;
    message: any;
  };
}) => import('winston').Logger;
