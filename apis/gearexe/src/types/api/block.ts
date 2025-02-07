export interface BlockHeader {
  readonly hash: string;
  readonly height: number;
  readonly timestamp: number;
  readonly parentHash: string;
}
