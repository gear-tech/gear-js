export interface KafkaPayload<T> {
  headers: any;
  key: string;
  value: T;
  partition: number
}
