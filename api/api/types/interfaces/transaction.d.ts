export interface TransactionStatusCb {
    (data: any): void | Promise<void>;
}
